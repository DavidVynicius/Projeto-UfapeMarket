"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function MeusProdutosPage() {
  const [meusProdutos, setMeusProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [usuarioId, setUsuarioId] = useState(null);

  useEffect(() => {
    // 1. Pega o usuário logado no localStorage
    const usuarioSalvo = localStorage.getItem("usuarioLogado");
    if (usuarioSalvo) {
      try {
        const dados = JSON.parse(usuarioSalvo);
        setUsuarioId(dados.id);

        // 2. Busca todos os produtos do backend
        fetch("http://localhost:8081/produtos")
          .then((res) => res.json())
          .then((produtos) => {
            // Filtra apenas os produtos do usuário logado
            const filtrados = produtos.filter(
              (p) => p.vendedor?.id === dados.id || p.idVendedor === dados.id,
            );
            setMeusProdutos(filtrados);
            setCarregando(false);
          })
          .catch((err) => {
            console.error("Erro ao buscar produtos:", err);
            setCarregando(false);
          });
      } catch (e) {
        console.error(e);
        setCarregando(false);
      }
    } else {
      setCarregando(false);
    }
  }, []);

  // Função para excluir um produto
  const handleExcluir = async (idProduto) => {
    if (confirm("Tem certeza que deseja excluir este anúncio?")) {
      try {
        const res = await fetch(`http://localhost:8081/produtos/${idProduto}`, {
          method: "DELETE",
        });

        if (res.ok) {
          // Remove da lista localmente
          setMeusProdutos(meusProdutos.filter((p) => p.id !== idProduto));
          alert("Produto excluído com sucesso!");
        } else {
          alert("Erro ao excluir o produto.");
        }
      } catch (e) {
        console.error(e);
        alert("Erro de conexão com o servidor.");
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* CABEÇALHO COM BOTÃO DE PUBLICAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Meus produtos</h1>
          <p className="text-sm text-ink-soft">
            {meusProdutos.length}{" "}
            {meusProdutos.length === 1
              ? "anúncio publicado."
              : "anúncios publicados."}
          </p>
        </div>

        <Link href="/explorar/publicar">
          <button className="py-2.5 px-5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer">
            <span className="text-lg font-bold">+</span>
            <span>Publicar produto</span>
          </button>
        </Link>
      </div>

      {carregando ? (
        <div className="text-center py-16 text-ink-faint">
          Carregando seus anúncios...
        </div>
      ) : meusProdutos.length === 0 ? (
        <div className="bg-surface rounded-3xl border border-line p-12 text-center space-y-4 max-w-lg mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-500 text-2xl flex items-center justify-center mx-auto">
            📦
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base text-ink">
              Nenhum produto publicado
            </h3>
            <p className="text-xs text-ink-soft">
              Você ainda não cadastrou nenhum item para venda no marketplace da
              UFAPE.
            </p>
          </div>
          <Link
            href="/explorar/publicar"
            className="inline-block px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs transition-all shadow-sm"
          >
            Publicar meu primeiro produto
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {meusProdutos.map((produto) => (
            <div
              key={produto.id}
              className="bg-surface rounded-3xl border border-line p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm transition-all hover:shadow-md"
            >
              {/* Lado Esquerdo: Foto e Informações Principais */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-20 h-20 rounded-2xl bg-canvas overflow-hidden shrink-0 border border-line">
                  <img
                    src={
                      produto.fotoProduto ||
                      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=300"
                    }
                    alt={produto.nome}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider">
                      {produto.categoria?.nome || "Geral"}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        produto.disponivelParaVenda
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-danger-soft text-danger"
                      }`}
                    >
                      {produto.disponivelParaVenda
                        ? "Disponível"
                        : "Indisponível"}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-ink truncate max-w-md">
                    {produto.nome}
                  </h3>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-extrabold text-brand-600 text-sm">
                      R${" "}
                      {produto.preco?.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                    <span className="text-ink-faint">•</span>
                    <span className="text-ink-soft font-medium">
                      {produto.quantidadeDisponivel} em estoque
                    </span>
                  </div>
                </div>
              </div>

              {/* Lado Direito: Botões de Ação (Ver, Editar, Excluir) */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-line">
                <Link href={`/explorar/produtos/${produto.id}`}>
                  <button className="px-3.5 py-2 rounded-xl border border-line bg-canvas hover:bg-line text-ink font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer">
                    <svg
                      className="w-3.5 h-3.5 text-ink-soft"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    Ver
                  </button>
                </Link>

                <Link href={`/explorar/produtos/editar/${produto.id}`}>
                  <button className="px-3.5 py-2 rounded-xl border border-line bg-canvas hover:bg-line text-ink font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer">
                    <svg
                      className="w-3.5 h-3.5 text-ink-soft"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Editar
                  </button>
                </Link>

                <button
                  onClick={() => handleExcluir(produto.id)}
                  className="px-3.5 py-2 rounded-xl border border-danger/30 bg-danger-soft hover:bg-danger/10 text-danger font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
