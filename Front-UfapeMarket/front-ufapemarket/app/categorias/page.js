'use client';

import { useState, useEffect } from 'react';

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState([]);
  const [nome, setNome] = useState('');
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const [carregando, setCarregando] = useState(false);
  const [categoriaParaDeletar, setCategoriaParaDeletar] = useState(null);

  const colors = {
    canvas: '#f6f5f1',
    surface: '#ffffff',
    ink: '#1c2620',
    inkSoft: '#55625b',
    inkFaint: '#8b968f',
    line: '#e7e6df',
    brand50: '#eefaf1',
    brand200: '#a9e5bd',
    brand500: '#1e9d5b',
    brand600: '#0f8049',
    brand700: '#0c663c',
    danger: '#d64545',
    dangerSoft: '#fbe3e3',
  };

  // Busca as categorias
  const carregarCategorias = async () => {
    try {
      const res = await fetch('http://localhost:8081/categorias');
      if (res.ok) {
        const dados = await res.json();
        setCategorias(dados);
      }
    } catch (err) {
      console.error('Erro ao buscar categorias:', err);
    }
  };

  useEffect(() => {
    carregarCategorias();
  }, []);

  // Cadastra nova categoria
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem({ tipo: '', texto: '' });
    setCarregando(true);

    try {
      const res = await fetch('http://localhost:8081/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome }),
      });

      if (res.status === 201) {
        setMensagem({ tipo: 'success', texto: 'Categoria criada com sucesso!' });
        setNome('');
        carregarCategorias();
      } else if (res.status === 409) {
        const erroMsg = await res.text();
        setMensagem({ tipo: 'error', texto: erroMsg || 'Esta categoria já está cadastrada.' });
      } else {
        setMensagem({ tipo: 'error', texto: 'Erro ao cadastrar categoria.' });
      }
    } catch (err) {
      setMensagem({ tipo: 'error', texto: 'Erro de conexão com o servidor.' });
    } finally {
      setCarregando(false);
    }
  };

  // Remove categoria por ID
  const handleDeletar = async () => {
    if (!categoriaParaDeletar) return;

    try {
      const res = await fetch(`http://localhost:8081/categorias/${categoriaParaDeletar.id}`, {
        method: 'DELETE',
      });

      if (res.status === 204 || res.ok) {
        setMensagem({ tipo: 'success', texto: 'Categoria excluída com sucesso!' });
        carregarCategorias();
      } else {
        setMensagem({ tipo: 'error', texto: 'Não foi possível excluir a categoria.' });
      }
    } catch (err) {
      setMensagem({ tipo: 'error', texto: 'Erro de conexão ao excluir.' });
    } finally {
      setCategoriaParaDeletar(null);
    }
  };

  return (
    <div 
      className="min-h-screen py-10 px-4 sm:px-6"
      style={{ backgroundColor: colors.canvas, color: colors.ink, fontFamily: 'sans-serif' }}
    >
      <div className="max-w-2xl mx-auto space-y-5">
        
        {/* Cabeçalho */}
        <div 
          className="rounded-2xl p-6 flex items-center justify-between border shadow-sm"
          style={{ backgroundColor: colors.surface, borderColor: colors.line }}
        >
          <div className="flex items-center gap-3.5">
            <div 
              className="p-3 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: colors.brand50, color: colors.brand600 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight" style={{ color: colors.ink }}>
                Gerenciar Categorias
              </h1>
              <p className="text-sm mt-0.5" style={{ color: colors.inkSoft }}>
                Organize os tipos de produtos do UfapeMarket
              </p>
            </div>
          </div>
          
          <span 
            className="text-xs font-semibold px-3 py-1.5 rounded-full border"
            style={{ 
              backgroundColor: colors.brand50, 
              color: colors.brand700,
              borderColor: colors.brand200
            }}
          >
            {categorias.length} {categorias.length === 1 ? 'categoria' : 'categorias'}
          </span>
        </div>

        {/* Alerta de Feedback */}
        {mensagem.texto && (
          <div 
            className="p-4 rounded-xl flex items-center gap-3 text-sm font-medium border"
            style={{
              backgroundColor: mensagem.tipo === 'success' ? colors.brand50 : colors.dangerSoft,
              color: mensagem.tipo === 'success' ? colors.brand700 : colors.danger,
              borderColor: mensagem.tipo === 'success' ? colors.brand200 : colors.danger
            }}
          >
            <span>{mensagem.texto}</span>
          </div>
        )}

        {/* Formulário de Nova Categoria */}
        <div 
          className="rounded-2xl p-6 border shadow-sm"
          style={{ backgroundColor: colors.surface, borderColor: colors.line }}
        >
          <h2 className="text-sm font-semibold mb-3" style={{ color: colors.ink }}>
            Nova Categoria
          </h2>
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite o nome da categoria..."
              className="flex-1 px-4 py-2.5 rounded-xl border text-sm transition-all outline-none"
              style={{ 
                borderColor: colors.line, 
                color: colors.ink,
                backgroundColor: colors.surface
              }}
              required
            />
            <button
              type="submit"
              disabled={carregando}
              className="text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              style={{ 
                backgroundColor: colors.brand500, 
                color: '#ffffff',
                opacity: carregando ? 0.7 : 1
              }}
            >
              <span>{carregando ? 'Adicionando...' : '+ Adicionar'}</span>
            </button>
          </form>
        </div>

        {/* Lista de Categorias Ativas */}
        <div 
          className="rounded-2xl p-6 border space-y-4 shadow-sm"
          style={{ backgroundColor: colors.surface, borderColor: colors.line }}
        >
          <h2 className="text-sm font-semibold" style={{ color: colors.ink }}>
            Categorias Ativas
          </h2>

          {categorias.length === 0 ? (
            <div 
              className="text-center py-10 border-2 border-dashed rounded-xl"
              style={{ borderColor: colors.line }}
            >
              <p className="text-sm" style={{ color: colors.inkFaint }}>
                Nenhuma categoria cadastrada no momento.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {categorias.map((cat) => (
                <div 
                  key={cat.id} 
                  className="flex items-center justify-between p-3.5 rounded-xl border transition-all"
                  style={{ 
                    borderColor: colors.line,
                    backgroundColor: colors.surface
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: colors.brand500 }}
                    ></span>
                    <span className="font-medium text-sm" style={{ color: colors.ink }}>
                      {cat.nome}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span 
                      className="text-xs font-mono px-2 py-1 rounded-md border"
                      style={{ 
                        color: colors.inkFaint, 
                        backgroundColor: colors.canvas,
                        borderColor: colors.line
                      }}
                    >
                      #{cat.id}
                    </span>
                    <button
                      onClick={() => setCategoriaParaDeletar(cat)}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: colors.inkFaint }}
                      title="Excluir Categoria"
                    >
                      <svg className="w-4 h-4 hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Modal de Confirmação de Exclusão */}
      {categoriaParaDeletar && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            className="rounded-2xl max-w-sm w-full p-6 space-y-4 border shadow-xl"
            style={{ 
              backgroundColor: colors.surface, 
              borderColor: colors.line
            }}
          >
            <div>
              <h3 className="font-bold" style={{ color: colors.ink }}>Excluir Categoria?</h3>
              <p className="text-sm mt-1" style={{ color: colors.inkSoft }}>
                Tem certeza que deseja remover <strong style={{ color: colors.ink }}>"{categoriaParaDeletar.nome}"</strong>?
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setCategoriaParaDeletar(null)}
                className="flex-1 px-4 py-2 rounded-xl border text-sm font-medium transition-colors"
                style={{ 
                  borderColor: colors.line, 
                  color: colors.inkSoft,
                  backgroundColor: colors.surface
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleDeletar}
                className="flex-1 px-4 py-2 rounded-xl text-white text-sm font-medium transition-colors shadow-sm"
                style={{ backgroundColor: colors.danger }}
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}