'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DetalhesProdutoPage() {
  const params = useParams();
  const router = useRouter();
  const idProduto = params?.id;

  const [produto, setProduto] = useState(null);
  const [maisDoVendedor, setMaisDoVendedor] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [favorito, setFavorito] = useState(false);

  useEffect(() => {
    if (!idProduto) return;

    // 1. Carrega o produto no backend
    fetch(`http://localhost:8081/produtos/${idProduto}`)
      .then((res) => {
        if (!res.ok) throw new Error('Produto não encontrado');
        return res.json();
      })
      .then((data) => {
        setProduto(data);
        setCarregando(false);

        // 2. Lê a chave 'produtosFavoritos' exatamente como o FavoritosPage
        const salvos = localStorage.getItem('produtosFavoritos');
        if (salvos) {
          try {
            const ids = JSON.parse(salvos);
            const numId = Number(data.id || idProduto);
            if (Array.isArray(ids) && ids.includes(numId)) {
              setFavorito(true);
            }
          } catch (e) {
            console.error(e);
          }
        }

        // 3. Busca outros produtos do mesmo vendedor
        const vendedorId = data.idVendedor || data.vendedor?.id;
        if (vendedorId) {
          fetch(`http://localhost:8081/produtos/vendedor/${vendedorId}`)
            .then((r) => (r.ok ? r.json() : []))
            .then((lista) => {
              setMaisDoVendedor(lista.filter((p) => Number(p.id || p.idProduto) !== Number(idProduto)));
            })
            .catch(() => {});
        }
      })
      .catch((err) => {
        console.error(err);
        setErro('Não foi possível carregar este produto.');
        setCarregando(false);
      });
  }, [idProduto]);

  // Salva e remove do 'produtosFavoritos'
  const toggleFavorito = () => {
    if (!produto) return;

    const numId = Number(produto.id || idProduto);
    const novoStatus = !favorito;
    setFavorito(novoStatus);

    const salvos = localStorage.getItem('produtosFavoritos');
    let listaIds = salvos ? JSON.parse(salvos) : [];

    if (!Array.isArray(listaIds)) {
      listaIds = [];
    }

    if (novoStatus) {
      if (!listaIds.includes(numId)) {
        listaIds.push(numId);
      }
    } else {
      listaIds = listaIds.filter((id) => Number(id) !== numId);
    }

    localStorage.setItem('produtosFavoritos', JSON.stringify(listaIds));
    window.dispatchEvent(new Event('storage'));
  };

  if (carregando) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-xs font-bold text-ink-faint animate-pulse">Carregando detalhes do produto...</p>
      </div>
    );
  }

  if (erro || !produto) {
    return (
      <div className="max-w-xl mx-auto text-center py-12 space-y-4">
        <p className="text-sm font-bold text-red-500">{erro || 'Produto não localizado.'}</p>
        <Link href="/explorar" className="text-xs font-bold text-brand-600 hover:underline">
          &lt; Voltar
        </Link>
      </div>
    );
  }

  // TRATAMENTO CORRIGIDO DA DISPONIBILIDADE
  const qtdDisponivel = produto.quantidadeDisponivel ?? 0;
  const semEstoque = qtdDisponivel <= 0;
  
  // O produto estará ativo se houver estoque e o atributo 'disponivel' não for explicitamente false
  const estaAtivo = !semEstoque && produto.disponivel !== false;

  const listaPagamentos = produto.formasPagamento
    ? produto.formasPagamento.split(',').map((p) => p.trim())
    : ['Pix', 'Dinheiro'];

  const notaVendedor = produto.notaVendedor || produto.vendedor?.nota;
  const qtdAvaliacoes = produto.quantidadeAvaliacoes || produto.vendedor?.quantidadeAvaliacoes || 0;
  const temAvaliacao = notaVendedor && qtdAvaliacoes > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      
      <div>
        <Link href="/explorar" className="text-xs font-bold text-ink-soft hover:text-ink transition-colors flex items-center gap-1">
          &lt; Voltar
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* FOTO DO PRODUTO */}
        <div className="lg:col-span-7 bg-[#E2E2E2] rounded-[32px] overflow-hidden aspect-square flex items-center justify-center p-8">
          <img
            src={produto.fotoProduto || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f'}
            alt={produto.nome}
            className="w-full h-full object-contain drop-shadow-md"
          />
        </div>

        {/* DETALHES DO PRODUTO */}
        <div className="lg:col-span-5 space-y-5">
          
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-[#E6F4EA] text-[#137333]">
              {produto.nomeCategoria || 'Eletrônicos'}
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-[#111827] tracking-tight">{produto.nome}</h1>
            
            <div className="flex items-center gap-3 pt-1">
              <span className="text-2xl font-extrabold text-[#111827]">
                R$ {produto.preco?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>

              {estaAtivo ? (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E6F4EA] text-[#137333]">
                  Disponível · {qtdDisponivel} un.
                </span>
              ) : semEstoque ? (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-700">
                  Esgotado
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700">
                  Pausado / Reservado
                </span>
              )}
            </div>
          </div>

          <p className="text-xs text-[#5F6368] leading-relaxed">
            {produto.descricaoProduto}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3.5 rounded-2xl border border-line flex items-center gap-3 shadow-2xs">
              <span className="text-brand-600 text-base">🕒</span>
              <div>
                <p className="text-[10px] text-ink-faint font-medium">Turno</p>
                <p className="text-xs font-bold text-[#111827]">{produto.turnoDisponibilidade || 'Integral'}</p>
              </div>
            </div>

            <div className="bg-[#FFFFFF] p-3.5 rounded-2xl border border-line flex items-center gap-3 shadow-2xs">
              <span className="text-brand-600 text-base">📦</span>
              <div>
                <p className="text-[10px] text-ink-faint font-medium">Estoque</p>
                <p className="text-xs font-bold text-[#111827]">{qtdDisponivel} unidades</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-line space-y-2 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-brand-600 text-sm">💳</span>
              <p className="text-[10px] text-ink-faint font-medium">Formas de pagamento</p>
            </div>
            <div className="flex flex-wrap gap-2 pl-6">
              {listaPagamentos.map((pag, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-full bg-[#F1F3F4] text-[11px] font-bold text-[#3C4043]">
                  {pag}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-line flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-500 text-white font-bold text-sm flex items-center justify-center overflow-hidden">
                {(produto.nomeVendedor || 'E').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-[10px] text-ink-faint font-medium">Vendido por</p>
                <p className="text-xs font-bold text-[#111827]">{produto.nomeVendedor || 'Estudante UFAPE'}</p>
                {produto.cursoVendedor && (
                  <p className="text-[10px] text-ink-faint">{produto.cursoVendedor}</p>
                )}
              </div>
            </div>

            {temAvaliacao && (
              <div className="text-right">
                <span className="text-xs font-bold text-[#111827] flex items-center gap-1 justify-end">
                  ★ {notaVendedor}
                </span>
                <p className="text-[10px] text-ink-faint">{qtdAvaliacoes} avaliações</p>
              </div>
            )}
          </div>

          {/* BOTOES */}
          <div className="flex items-center gap-3 pt-1">
            <button
              disabled={!estaAtivo}
              onClick={() => alert('Iniciando processo de compra...')}
              className={`flex-1 py-3.5 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-xs ${
                estaAtivo
                  ? 'bg-[#0F8B4C] hover:bg-[#0C733F] text-white active:scale-95 cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              🛒 {estaAtivo ? 'Comprar' : semEstoque ? 'Produto Esgotado' : 'Indisponível'}
            </button>

            {/* BOTÃO DE CONVERSAR ATUALIZADO */}
            <button
                onClick={() => {
                    const vendedorId = produto.idVendedor || produto.vendedor?.id;
                    const query = new URLSearchParams({
                    vendedor: vendedorId || '',
                    nomeVendedor: produto.nomeVendedor || 'Estudante UFAPE',
                    produtoId: produto.id || idProduto,
                    produtoNome: produto.nome || '',
                    produtoPreco: produto.preco || 0,
                    produtoFoto: produto.fotoProduto || '',
                    }).toString();

                    router.push(`/explorar/conversas?${query}`);
                }}
                className="px-5 py-3.5 rounded-2xl border border-line bg-white hover:bg-canvas text-[#111827] font-bold text-xs transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                >
                💬 Conversar
            </button>

            {/* BOTÃO DE FAVORITAR COM FUNDO BRANCO E CORAÇÃO VERMELHO */}
            <button
              onClick={toggleFavorito}
              className="w-11 h-11 rounded-2xl border border-line bg-white hover:bg-canvas flex items-center justify-center text-base shadow-2xs transition-all cursor-pointer active:scale-95"
              title={favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >
              <span className={favorito ? 'text-red-500' : 'text-gray-400'}>
                {favorito ? '❤️' : '🤍'}
              </span>
            </button>
          </div>

          <div className="text-center pt-1">
            <p className="text-[11px] text-ink-faint flex items-center justify-center gap-1.5 font-medium">
              🛡️ Negocie sempre dentro do campus da UFAPE.
            </p>
          </div>

        </div>
      </div>

      {/* MAIS DO MESMO VENDEDOR */}
      {maisDoVendedor.length > 0 && (
        <div className="space-y-4 pt-8 border-t border-line">
          <h2 className="text-base font-extrabold text-[#111827]">
            Mais de {produto.nomeVendedor || 'este vendedor'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {maisDoVendedor.map((item) => (
              <Link
                key={item.id || item.idProduto}
                href={`/explorar/${item.id || item.idProduto}`}
                className="bg-white rounded-2xl border border-line overflow-hidden hover:shadow-md transition-all group block"
              >
                <div className="h-36 bg-canvas overflow-hidden">
                  <img
                    src={item.fotoProduto || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f'}
                    alt={item.nome}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-3 space-y-1">
                  <h3 className="font-bold text-xs text-[#111827] truncate">{item.nome}</h3>
                  <p className="text-[#0F8B4C] font-extrabold text-xs">
                    R$ {item.preco?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}