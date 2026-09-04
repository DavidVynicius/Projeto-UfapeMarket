'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MensagensPage() {
  const router = useRouter();

  const [conversas, setConversas] = useState([
    {
      id: 1,
      nome: 'Rafael Nunes',
      curso: 'Engenharia Agrícola',
      produto: 'Livro: Estruturas de Dados',
      produtoId: 10,
      preco: 'R$ 60,00',
      fotoProduto: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150',
      hora: '15:49',
      ultimaMensagem: 'Você: Olá, Rafael! Acabei de comp...',
      mensagensIniciais: [
        {
          id: 101,
          texto: 'Olá, Rafael! Acabei de comprar 1x "Livro: Estruturas de Dados". Podemos combinar a entrega? 📦',
          ehMinha: true,
          hora: '15:49',
        },
      ],
    },
    {
      id: 2,
      nome: 'Marina Cavalcanti',
      curso: 'Agronomia',
      produto: 'Brownie Recheado',
      produtoId: 12,
      preco: 'R$ 8,00',
      fotoProduto: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=150',
      hora: '09:16',
      ultimaMensagem: 'Conversa iniciada',
      mensagensIniciais: [],
    },
  ]);

  const [conversaAtiva, setConversaAtiva] = useState(conversas[0]);
  const [mensagens, setMensagens] = useState(conversas[0].mensagensIniciais);
  const [texto, setTexto] = useState('');
  const [carregando, setCarregando] = useState(false);

  const colors = {
    canvas: '#f6f5f1',
    surface: '#ffffff',
    ink: '#1c2620',
    inkSoft: '#55625b',
    inkFaint: '#8b968f',
    line: '#e7e6df',
    brand50: '#eefaf1',
    brand500: '#0f8049',
    danger: '#d64545',
  };

  const selecionarConversa = (conversa) => {
    setConversaAtiva(conversa);
    setMensagens(conversa.mensagensIniciais || []);
  };

  // Redireciona ou exibe aviso enquanto a tela de produtos não existe
  const handleAbrirProduto = (produtoId) => {
    // Quando a rota de produtos existir, desative o alert e ative o router.push:
    // router.push(`/produtos/${produtoId}`);
    alert(`Redirecionando para os detalhes do produto #${produtoId}... (A página de produtos será integrada em breve!)`);
  };

  // POST: Enviar mensagem
  const handleEnviar = async (e) => {
    e.preventDefault();
    if (!texto.trim() || !conversaAtiva) return;

    const textoNovaMsg = texto;
    const horaAtual = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTexto('');
    setCarregando(true);

    try {
      const res = await fetch('http://localhost:8081/mensagens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conteudo: textoNovaMsg,
          chatId: conversaAtiva.id,
          remetenteId: 1,
        }),
      });

      const novaMsgObj = {
        id: Date.now(),
        texto: textoNovaMsg,
        ehMinha: true,
        hora: horaAtual,
      };

      setMensagens((prev) => [...prev, novaMsgObj]);

      setConversas((prev) =>
        prev.map((c) =>
          c.id === conversaAtiva.id
            ? { ...c, ultimaMensagem: `Você: ${textoNovaMsg}`, hora: horaAtual, mensagensIniciais: [...c.mensagensIniciais, novaMsgObj] }
            : c
        )
      );
    } catch (err) {
      console.error('Erro ao enviar:', err);
    } finally {
      setCarregando(false);
    }
  };

  // DELETE: Remover mensagem por ID (API + Estado local)
  const handleRemoverMensagem = async (idMensagem) => {
    try {
      await fetch(`http://localhost:8081/mensagens/${idMensagem}`, {
        method: 'DELETE',
      });

      setMensagens((prev) => prev.filter((m) => m.id !== idMensagem));

      setConversas((prevConversas) =>
        prevConversas.map((c) => {
          if (c.id === conversaAtiva.id) {
            const novasMsgs = (c.mensagensIniciais || []).filter((m) => m.id !== idMensagem);
            const ultima = novasMsgs[novasMsgs.length - 1];
            return {
              ...c,
              mensagensIniciais: novasMsgs,
              ultimaMensagem: ultima ? `Você: ${ultima.texto}` : 'Conversa iniciada',
            };
          }
          return c;
        })
      );
    } catch (err) {
      console.error('Erro ao apagar mensagem:', err);
    }
  };

  return (
    <div 
      className="min-h-screen p-4 md:p-6"
      style={{ backgroundColor: colors.canvas, color: colors.ink, fontFamily: 'sans-serif' }}
    >
      <div 
        className="max-w-6xl mx-auto rounded-2xl border shadow-sm flex flex-col md:flex-row h-[720px] overflow-hidden"
        style={{ backgroundColor: colors.surface, borderColor: colors.line }}
      >
        
        {/* COLUNA ESQUERDA: Conversas */}
        <div 
          className="w-full md:w-80 lg:w-96 border-r flex flex-col"
          style={{ borderColor: colors.line }}
        >
          <div className="p-5 border-b flex justify-between items-center" style={{ borderColor: colors.line }}>
            <h1 className="text-xl font-bold tracking-tight" style={{ color: colors.ink }}>
              Conversas
            </h1>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: colors.brand50, color: colors.brand500 }}>
              {conversas.length} ativas
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y" style={{ borderColor: colors.line }}>
            {conversas.map((c) => {
              const selecionada = conversaAtiva && c.id === conversaAtiva.id;
              return (
                <div
                  key={c.id}
                  onClick={() => selecionarConversa(c)}
                  className="p-4 flex items-center gap-3 cursor-pointer transition-colors"
                  style={{
                    backgroundColor: selecionada ? colors.brand50 : 'transparent',
                  }}
                >
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                    style={{ backgroundColor: colors.brand50, color: colors.brand500 }}
                  >
                    {c.nome.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h2 className="text-sm font-bold truncate" style={{ color: colors.ink }}>
                        {c.nome}
                      </h2>
                      <span className="text-xs shrink-0 ml-2" style={{ color: colors.inkFaint }}>
                        {c.hora}
                      </span>
                    </div>
                    {c.produto && (
                      <p className="text-xs font-medium truncate mb-0.5" style={{ color: colors.brand500 }}>
                        {c.produto}
                      </p>
                    )}
                    <p className="text-xs truncate" style={{ color: colors.inkSoft }}>
                      {c.ultimaMensagem}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUNA DIREITA: Chat */}
        <div className="flex-1 flex flex-col bg-white">
          
          {/* Cabeçalho */}
          <div 
            className="p-4 border-b flex items-center gap-3"
            style={{ borderColor: colors.line }}
          >
            <div 
              className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
              style={{ backgroundColor: colors.brand50, color: colors.brand500 }}
            >
              {conversaAtiva.nome.charAt(0)}
            </div>
            <div>
              <h2 className="text-sm font-bold" style={{ color: colors.ink }}>
                {conversaAtiva.nome}
              </h2>
              <p className="text-xs" style={{ color: colors.inkSoft }}>
                {conversaAtiva.curso}
              </p>
            </div>
          </div>

          {/* Banner do Produto (Clicável) */}
          {conversaAtiva.produto && (
            <div 
              onClick={() => handleAbrirProduto(conversaAtiva.produtoId)}
              className="p-3 px-4 border-b flex items-center justify-between cursor-pointer hover:bg-[#f3f2eb] transition-colors group"
              style={{ backgroundColor: '#fcfcf9', borderColor: colors.line }}
              title="Clique para ver os detalhes do produto"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg border overflow-hidden shrink-0 group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: '#f3f2eb', borderColor: colors.line }}
                >
                  <img src={conversaAtiva.fotoProduto} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider block" style={{ color: colors.inkFaint }}>
                    Sobre o produto
                  </span>
                  <span className="text-xs font-bold group-hover:underline" style={{ color: colors.ink }}>
                    {conversaAtiva.produto}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold" style={{ color: colors.brand500 }}>
                  {conversaAtiva.preco}
                </span>
                <svg className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          )}

          {/* Histórico das Mensagens */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#faf9f6]">
            {mensagens.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center">
                <p className="text-xs" style={{ color: colors.inkFaint }}>
                  Esta conversa ainda não possui mensagens. Digite abaixo para iniciar o papo!
                </p>
              </div>
            ) : (
              mensagens.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex items-center gap-2 group ${msg.ehMinha ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Botão de Excluir Mensagem */}
                  {msg.ehMinha && (
                    <button
                      onClick={() => handleRemoverMensagem(msg.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-xs hover:text-red-600"
                      style={{ color: colors.inkFaint }}
                      title="Apagar mensagem"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}

                  <div 
                    className="max-w-md p-3.5 px-4 rounded-2xl text-sm shadow-sm relative"
                    style={{ 
                      backgroundColor: msg.ehMinha ? colors.brand500 : colors.surface,
                      color: msg.ehMinha ? '#ffffff' : colors.ink,
                      border: msg.ehMinha ? 'none' : `1px solid ${colors.line}`,
                      borderBottomRightRadius: msg.ehMinha ? '4px' : '16px',
                      borderBottomLeftRadius: msg.ehMinha ? '16px' : '4px',
                    }}
                  >
                    <p className="leading-relaxed">{msg.texto}</p>
                    <span 
                      className="text-[10px] block mt-1 text-right"
                      style={{ color: msg.ehMinha ? 'rgba(255,255,255,0.75)' : colors.inkFaint }}
                    >
                      {msg.hora}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Campo de Digitação */}
          <div className="p-4 border-t" style={{ borderColor: colors.line, backgroundColor: colors.surface }}>
            <form onSubmit={handleEnviar} className="flex items-center gap-3">
              <input
                type="text"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Digite uma mensagem..."
                className="flex-1 px-5 py-3 rounded-full border text-sm outline-none transition-all placeholder:text-slate-400"
                style={{ 
                  borderColor: colors.line, 
                  backgroundColor: colors.canvas,
                  color: colors.ink
                }}
              />
              <button
                type="submit"
                disabled={carregando || !texto.trim()}
                className="w-11 h-11 rounded-full flex items-center justify-center text-white transition-all shadow-sm shrink-0"
                style={{ 
                  backgroundColor: colors.brand500,
                  opacity: carregando || !texto.trim() ? 0.6 : 1
                }}
              >
                <svg className="w-5 h-5 transform rotate-90 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}