"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function FavoritosPage() {
  const [produtos, setProdutos] = useState([]);
  const [favoritosIds, setFavoritosIds] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // 1. Carrega todos os produtos do backend
    fetch("http://localhost:8081/produtos")
      .then((res) => res.json())
      .then((data) => {
        setProdutos(data);
        setCarregando(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar produtos:", err);
        setCarregando(false);
      });

    // 2. Carrega os IDs dos favoritos salvos no localStorage
    const favSalvos = localStorage.getItem("produtosFavoritos");
    if (favSalvos) {
      try {
        setFavoritosIds(JSON.parse(favSalvos));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Remover ou alternar favorito direto da página de favoritos
  const toggleFavorito = (idProduto) => {
    const novosFavoritos = favoritosIds.filter((id) => id !== idProduto);
    setFavoritosIds(novosFavoritos);
    localStorage.setItem("produtosFavoritos", JSON.stringify(novosFavoritos));
  };

  // Filtra apenas os produtos cujos IDs estão na lista de favoritos
  const produtosFavoritados = produtos.filter((p) =>
    favoritosIds.includes(p.id),
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-2xl font-extrabold text-ink">Meus favoritos</h1>
        <p className="text-sm text-ink-soft">
          {produtosFavoritados.length}{" "}
          {produtosFavoritados.length === 1
            ? "produto salvo."
            : "produtos salvos."}
        </p>
      </div>

      {carregando ? (
        <div className="text-center py-16 text-ink-faint">
          Carregando seus favoritos...
        </div>
      ) : produtosFavoritados.length === 0 ? (
        <div className="bg-surface rounded-3xl border border-line p-12 text-center space-y-4 max-w-lg mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-danger-soft text-danger text-2xl flex items-center justify-center mx-auto">
            ♡
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base text-ink">
              Nenhum produto nos favoritos
            </h3>
            <p className="text-xs text-ink-soft">
              Explore o marketplace e clique no ícone de coração nos produtos
              que você mais gostar!
            </p>
          </div>
          <Link
            href="/explorar/busca"
            className="inline-block px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs transition-all shadow-sm"
          >
            Explorar produtos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {produtosFavoritados.map((produto) => (
            <div
              key={produto.id}
              className="bg-surface rounded-3xl border border-line overflow-hidden shadow-sm flex flex-col group relative transition-all hover:shadow-md"
            >
              {/* Botão de Favorito Ativo (Coração Vermelho) */}
              <button
                onClick={() => toggleFavorito(produto.id)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow-sm flex items-center justify-center transition-all hover:scale-110 cursor-pointer z-10"
                title="Remover dos favoritos"
              >
                <svg
                  className="w-5 h-5 text-red-500 fill-red-500 transition-colors"
                  fill="currentColor"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>

              {/* Foto do Produto */}
              <div className="relative h-48 w-full bg-canvas overflow-hidden">
                <img
                  src={
                    produto.fotoProduto ||
                    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=400"
                  }
                  alt={produto.nome}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {!produto.disponivelParaVenda && (
                  <span className="absolute top-3 left-3 bg-danger/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Indisponível
                  </span>
                )}
              </div>

              {/* Detalhes */}
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider block">
                    {produto.categoria?.nome || "Geral"}
                  </span>
                  <h3 className="font-bold text-sm text-ink line-clamp-1">
                    {produto.nome}
                  </h3>
                  <span className="font-extrabold text-lg text-brand-600 block">
                    R${" "}
                    {produto.preco?.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <div className="pt-3 border-t border-line flex items-center justify-between text-xs text-ink-faint">
                  <div className="flex items-center gap-1.5 truncate">
                    <div className="w-5 h-5 rounded-full bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {produto.vendedor?.nome
                        ? produto.vendedor.nome.charAt(0).toUpperCase()
                        : "U"}
                    </div>
                    <span className="truncate">
                      {produto.vendedor?.nome || "Estudante UFAPE"}
                    </span>
                  </div>
                  <span className="shrink-0">
                    {produto.quantidadeDisponivel} disp.
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
