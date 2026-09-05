"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ExplorarPage() {
  const [produtosDestaque, setProdutosDestaque] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [favoritosIds, setFavoritosIds] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8081/produtos", {
      cache: "no-store",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erro ao conectar com a API");
        }

        return res.json();
      })
      .then((data) => {
        setProdutosDestaque(data);
        setCarregando(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar produtos:", err);
        setCarregando(false);
      });

    const favSalvos = localStorage.getItem("produtosFavoritos");

    if (favSalvos) {
      try {
        setFavoritosIds(JSON.parse(favSalvos));
      } catch (erro) {
        console.error("Erro ao carregar favoritos:", erro);
      }
    }
  }, []);

  const toggleFavorito = (idProduto) => {
    let novosFavoritos;

    if (favoritosIds.includes(idProduto)) {
      novosFavoritos = favoritosIds.filter(
        (id) => id !== idProduto
      );
    } else {
      novosFavoritos = [
        ...favoritosIds,
        idProduto
      ];
    }

    setFavoritosIds(novosFavoritos);

    localStorage.setItem(
      "produtosFavoritos",
      JSON.stringify(novosFavoritos)
    );
  };

  return (
    <div className="space-y-8">

      {/* BANNER PRINCIPAL */}
      <div className="bg-brand-500 text-white p-8 lg:p-10 rounded-3xl space-y-4 relative overflow-hidden shadow-sm">

        <div className="space-y-2 max-w-xl">

          <p className="text-sm font-medium text-brand-100 flex items-center gap-1.5">
            Olá! 👋
          </p>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
            Encontre o que precisa dentro da UFAPE.
          </h1>

          <p className="text-brand-100/90 text-sm">
            Compre e venda produtos, materiais e serviços diretamente entre estudantes.
          </p>

        </div>

        <div className="pt-2 flex items-center gap-3">

          <Link
            href="/explorar/publicar"
            className="bg-surface text-brand-600 hover:bg-brand-50 px-6 py-2.5 rounded-full font-bold text-sm transition-all active:scale-95 shadow-sm inline-block"
          >
            Publicar um produto
          </Link>

        </div>

      </div>

      {/* CATEGORIAS */}
      <section className="space-y-4">

        <div className="flex items-center justify-between">

          <h2 className="text-lg font-bold text-ink">
            Categorias
          </h2>

          <Link
            href="/explorar/categorias"
            className="text-xs font-semibold text-brand-500 hover:underline flex items-center gap-1"
          >
            Ver todas <span>→</span>
          </Link>

        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">

          {[
            { nome: "Livros", icone: "📖" },
            { nome: "Eletrônicos", icone: "🎧" },
            { nome: "Alimentos", icone: "🥪" },
            { nome: "Material Escolar", icone: "✏️" },
            { nome: "Vestuário", icone: "👕" },
            { nome: "Acessórios", icone: "⌚" }
          ].map((cat) => (

            <Link
              key={cat.nome}
              href="/explorar/categorias"
              className="bg-surface p-3.5 rounded-2xl border border-line flex items-center gap-3 hover:shadow-md transition-all cursor-pointer"
            >

              <span className="text-xl">
                {cat.icone}
              </span>

              <span className="text-xs font-semibold text-ink-soft">
                {cat.nome}
              </span>

            </Link>

          ))}

        </div>

      </section>

      {/* ATALHOS */}
      <section className="space-y-4">

        <h2 className="text-lg font-bold text-ink">
          Seus atalhos
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

          <Link
            href="/explorar/publicar"
            className="bg-surface p-4 rounded-2xl border border-line flex items-center gap-3.5 hover:shadow-md transition-all cursor-pointer"
          >

            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-500 flex items-center justify-center font-bold text-lg">
              +
            </div>

            <span className="text-xs font-bold text-ink-soft">
              Publicar produto
            </span>

          </Link>

          <Link
            href="/explorar/favoritos"
            className="bg-surface p-4 rounded-2xl border border-line flex items-center gap-3.5 hover:shadow-md transition-all cursor-pointer"
          >

            <div className="w-10 h-10 rounded-xl bg-danger-soft text-danger flex items-center justify-center">
              ♡
            </div>

            <span className="text-xs font-bold text-ink-soft">
              Ver favoritos
            </span>

          </Link>

          <Link
            href="/explorar/conversas"
            className="bg-surface p-4 rounded-2xl border border-line flex items-center gap-3.5 hover:shadow-md transition-all cursor-pointer"
          >

            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              💬
            </div>

            <span className="text-xs font-bold text-ink-soft">
              Ver conversas
            </span>

          </Link>

          <div className="bg-surface p-4 rounded-2xl border border-line flex items-center gap-3.5 hover:shadow-md transition-all cursor-pointer">

            <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center">
              🔔
            </div>

            <span className="text-xs font-bold text-ink-soft">
              Notificações
            </span>

          </div>

        </div>

      </section>

      {/* PRODUTOS EM DESTAQUE */}
      <section className="space-y-4 pt-2">

        <div className="flex items-center justify-between">

          <h2 className="text-lg font-bold text-ink">
            Produtos em destaque
          </h2>

          <Link
            href="/explorar/busca"
            className="text-xs font-semibold text-brand-500 hover:underline flex items-center gap-1"
          >
            Explorar tudo <span>→</span>
          </Link>

        </div>

        {carregando ? (

          <p className="text-sm text-ink-faint py-4">
            Carregando produtos do banco de dados...
          </p>

        ) : produtosDestaque.length === 0 ? (

          <div className="bg-surface p-8 rounded-3xl border border-line text-center space-y-3">

            <p className="text-sm font-semibold text-ink-soft">
              Nenhum produto cadastrado no banco ainda.
            </p>

            <Link
              href="/explorar/publicar"
              className="inline-block px-4 py-2 rounded-xl bg-brand-500 text-white font-bold text-xs"
            >
              Cadastrar o primeiro produto
            </Link>

          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {produtosDestaque.map((prod) => {
              const isFavorito =
                favoritosIds.includes(prod.id);

              return (

                <div
                  key={prod.id}
                  className="bg-surface rounded-3xl border border-line overflow-hidden hover:shadow-lg transition-all flex flex-col group relative"
                >

                  {/* FOTO */}
                  <div className="relative h-48 w-full bg-canvas overflow-hidden">

                    <img
                      src={
                        prod.fotoProduto ||
                        prod.imagemUrl ||
                        prod.imagem ||
                        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400"
                      }
                      alt={prod.nome || prod.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        toggleFavorito(prod.id)
                      }
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow-sm flex items-center justify-center transition-all hover:scale-110 cursor-pointer z-10"
                      title={
                        isFavorito
                          ? "Remover dos favoritos"
                          : "Favoritar produto"
                      }
                    >

                      <svg
                        className={`w-5 h-5 transition-colors ${
                          isFavorito
                            ? "text-red-500 fill-red-500"
                            : "text-ink-soft hover:text-red-500"
                        }`}
                        fill={
                          isFavorito
                            ? "currentColor"
                            : "none"
                        }
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

                  </div>

                  {/* INFORMAÇÕES */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">

                    <div className="space-y-1">

                      <span className="text-[11px] font-bold text-brand-500 uppercase tracking-wide">
                        {prod.categoria?.nome ||
                          prod.categoria ||
                          ""}
                      </span>

                      <h3 className="font-bold text-sm text-ink line-clamp-1">
                        {prod.nome || prod.titulo}
                      </h3>

                    </div>

                    <div className="flex items-baseline gap-2">

                      <span className="font-extrabold text-base text-brand-600">
                        R${" "}
                        {Number(
                          prod.preco || 0
                        ).toLocaleString(
                          "pt-BR",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }
                        )}
                      </span>

                      <span className="text-xs text-ink-faint">
                        {prod.quantidadeDisponivel !== undefined
                          ? `${prod.quantidadeDisponivel} disp.`
                          : prod.disponivel}
                      </span>

                    </div>

                    <div className="pt-2 border-t border-line flex items-center gap-2">

                      <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 text-[10px] font-bold flex items-center justify-center shrink-0">

                        {prod.vendedor?.nome
                          ? prod.vendedor.nome
                              .charAt(0)
                              .toUpperCase()
                          : "U"}

                      </div>

                      <span className="text-xs font-medium text-ink-soft truncate">
                        {prod.vendedor?.nome ||
                          "Estudante UFAPE"}
                      </span>

                    </div>

                  </div>

                </div>

              );
            })}

          </div>

        )}

      </section>

    </div>
  );
}