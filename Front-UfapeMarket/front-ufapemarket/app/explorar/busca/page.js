"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ExplorarBuscaPage() {
  const searchParams = useSearchParams();

  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [favoritosIds, setFavoritosIds] = useState([]);

  // Estados dos filtros
  const [termoBusca, setTermoBusca] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [precoMaximo, setPrecoMaximo] = useState(500);
  const [somenteDisponiveis, setSomenteDisponiveis] = useState(false);
  const [turnoSelecionado, setTurnoSelecionado] = useState("");
  const [formaPagamentoSelecionada, setFormaPagamentoSelecionada] =
    useState("");
  const [ordenacao, setOrdenacao] = useState("recentes");

  useEffect(() => {
    const termoUrl = searchParams.get("termo");
    const categoriaUrl = searchParams.get("categoria");

    if (termoUrl) {
      setTermoBusca(termoUrl);
    }

    if (categoriaUrl) {
      setCategoriaSelecionada(categoriaUrl);
    }

    async function carregarDados() {
      setCarregando(true);

      try {
        const [resProdutos, resCategorias] = await Promise.all([
          fetch("http://localhost:8081/produtos", {
            cache: "no-store",
          }),

          fetch("http://localhost:8081/categorias", {
            cache: "no-store",
          }),
        ]);

        if (!resProdutos.ok) {
          throw new Error("Erro ao buscar produtos");
        }

        if (!resCategorias.ok) {
          throw new Error("Erro ao buscar categorias");
        }

        const dadosProdutos = await resProdutos.json();
        const dadosCategorias = await resCategorias.json();

        setProdutos(dadosProdutos);
        setCategorias(dadosCategorias);
      } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();

    const favSalvos = localStorage.getItem("produtosFavoritos");

    if (favSalvos) {
      try {
        setFavoritosIds(JSON.parse(favSalvos));
      } catch (erro) {
        console.error("Erro ao carregar favoritos:", erro);
      }
    }
  }, [searchParams]);

  // Alternar favorito
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

  // Filtragem
  const produtosFiltrados = produtos
    .filter((produto) => {
      const termo = termoBusca.toLowerCase();

      const matchTermo =
        produto.nome
          ?.toLowerCase()
          .includes(termo) ||
        produto.descricaoProduto
          ?.toLowerCase()
          .includes(termo);

      const matchCategoria =
        !categoriaSelecionada ||
        Number(produto.idCategoria) ===
          Number(categoriaSelecionada);

      const matchPreco =
        Number(produto.preco || 0) <= precoMaximo;

      const matchDisponibilidade =
        !somenteDisponiveis ||
        produto.disponivelParaVenda === true;

      const matchTurno =
        !turnoSelecionado ||
        produto.turnoDisponibilidade ===
          turnoSelecionado;

      const matchPagamento =
        !formaPagamentoSelecionada ||
        produto.formasPagamento
          ?.toLowerCase()
          .includes(
            formaPagamentoSelecionada.toLowerCase()
          );

      return (
        matchTermo &&
        matchCategoria &&
        matchPreco &&
        matchDisponibilidade &&
        matchTurno &&
        matchPagamento
      );
    })
    .sort((a, b) => {
      if (ordenacao === "maior-preco") {
        return (
          Number(b.preco || 0) -
          Number(a.preco || 0)
        );
      }

      if (ordenacao === "menor-preco") {
        return (
          Number(a.preco || 0) -
          Number(b.preco || 0)
        );
      }

      return Number(b.id) - Number(a.id);
    });

  const limparFiltros = () => {
    setTermoBusca("");
    setCategoriaSelecionada("");
    setPrecoMaximo(500);
    setSomenteDisponiveis(false);
    setTurnoSelecionado("");
    setFormaPagamentoSelecionada("");
    setOrdenacao("recentes");
  };

  return (
    <div className="space-y-6 pb-12">

      {/* CABEÇALHO */}
      <div>
        <h1 className="text-2xl font-extrabold text-ink">
          Explorar produtos
        </h1>

        <p className="text-sm text-ink-soft">
          Encontre produtos anunciados por outros estudantes.
        </p>
      </div>

      {/* BUSCA E ORDENAÇÃO */}
      <div className="flex flex-col sm:flex-row items-center gap-4">

        <div className="relative flex-1 w-full">

          <input
            type="text"
            value={termoBusca}
            onChange={(e) =>
              setTermoBusca(e.target.value)
            }
            placeholder="Busque por produtos..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-line bg-surface text-ink text-sm outline-none focus:ring-2 focus:ring-brand-500/25 transition-all placeholder:text-ink-faint shadow-sm"
          />

          <svg
            className="w-4 h-4 absolute left-4 top-4 text-ink-faint"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

        </div>

        <select
          value={ordenacao}
          onChange={(e) =>
            setOrdenacao(e.target.value)
          }
          className="px-4 py-3 rounded-2xl border border-line bg-surface text-ink text-sm font-medium outline-none focus:ring-2 focus:ring-brand-500/25 cursor-pointer shadow-sm w-full sm:w-auto"
        >
          <option value="recentes">
            Mais recentes
          </option>

          <option value="menor-preco">
            Menor preço
          </option>

          <option value="maior-preco">
            Maior preço
          </option>
        </select>

      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

        {/* FILTROS */}
        <div className="bg-surface p-6 rounded-3xl border border-line space-y-6 shadow-sm lg:sticky lg:top-24">

          <div className="flex items-center justify-between border-b border-line pb-3">

            <div className="flex items-center gap-2 text-ink font-bold text-sm">

              <svg
                className="w-4 h-4 text-brand-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>

              Filtros

            </div>

            <button
              type="button"
              onClick={limparFiltros}
              className="text-xs font-semibold text-brand-600 hover:underline cursor-pointer"
            >
              Limpar filtros
            </button>

          </div>

          {/* CATEGORIA */}
          <div className="space-y-2">

            <label className="text-xs font-bold text-ink uppercase tracking-wider block">
              Categoria
            </label>

            <select
              value={categoriaSelecionada}
              onChange={(e) =>
                setCategoriaSelecionada(
                  e.target.value
                )
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-canvas text-ink text-sm outline-none focus:ring-2 focus:ring-brand-500/25 cursor-pointer"
            >

              <option value="">
                Todas as categorias
              </option>

              {categorias.map((categoria) => (
                <option
                  key={categoria.id}
                  value={categoria.id}
                >
                  {categoria.nome}
                </option>
              ))}

            </select>

          </div>

          {/* PREÇO */}
          <div className="space-y-2">

            <div className="flex justify-between text-xs font-bold text-ink">
              <span>
                Preço máximo
              </span>

              <span className="text-brand-600">
                R$ {precoMaximo}
              </span>
            </div>

            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={precoMaximo}
              onChange={(e) =>
                setPrecoMaximo(
                  Number(e.target.value)
                )
              }
              className="w-full accent-brand-500 cursor-pointer"
            />

          </div>

          {/* DISPONIBILIDADE */}
          <div className="flex items-center justify-between pt-2 border-t border-line">

            <span className="text-xs font-bold text-ink">
              Somente disponíveis
            </span>

            <input
              type="checkbox"
              checked={somenteDisponiveis}
              onChange={(e) =>
                setSomenteDisponiveis(
                  e.target.checked
                )
              }
              className="w-4 h-4 accent-brand-500 cursor-pointer"
            />

          </div>

          {/* TURNO */}
          <div className="space-y-2 pt-2 border-t border-line">

            <label className="text-xs font-bold text-ink uppercase tracking-wider block">
              Turno de disponibilidade
            </label>

            <div className="grid grid-cols-2 gap-2 text-xs font-medium">

              {[
                "Integral",
                "Manhã",
                "Tarde",
                "Noite"
              ].map((turno) => (

                <button
                  key={turno}
                  type="button"
                  onClick={() =>
                    setTurnoSelecionado(
                      turnoSelecionado === turno
                        ? ""
                        : turno
                    )
                  }
                  className={`py-2 px-3 rounded-xl border transition-all text-center cursor-pointer ${
                    turnoSelecionado === turno
                      ? "border-brand-500 bg-brand-50 text-brand-700 font-semibold"
                      : "border-line bg-canvas text-ink-soft hover:bg-line"
                  }`}
                >
                  {turno}
                </button>

              ))}

            </div>

          </div>

          {/* PAGAMENTO */}
          <div className="space-y-2 pt-2 border-t border-line">

            <label className="text-xs font-bold text-ink uppercase tracking-wider block">
              Forma de pagamento
            </label>

            <div className="flex flex-wrap gap-2">

              {[
                "Pix",
                "Dinheiro",
                "Cartão",
                "Transferência"
              ].map((pagamento) => (

                <button
                  key={pagamento}
                  type="button"
                  onClick={() =>
                    setFormaPagamentoSelecionada(
                      formaPagamentoSelecionada ===
                        pagamento
                        ? ""
                        : pagamento
                    )
                  }
                  className={`py-1.5 px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    formaPagamentoSelecionada ===
                    pagamento
                      ? "border-brand-500 bg-brand-50 text-brand-700 font-semibold"
                      : "border-line bg-canvas text-ink-soft hover:bg-line"
                  }`}
                >
                  {pagamento}
                </button>

              ))}

            </div>

          </div>

        </div>

        {/* PRODUTOS */}
        <div className="lg:col-span-3 space-y-4">

          <p className="text-xs font-bold text-ink-faint uppercase tracking-wider">
            {produtosFiltrados.length}{" "}
            {produtosFiltrados.length === 1
              ? "produto encontrado"
              : "produtos encontrados"}
          </p>

          {carregando ? (

            <div className="text-center py-16 text-ink-faint">
              Carregando anúncios da UFAPE...
            </div>

          ) : produtosFiltrados.length === 0 ? (

            <div className="bg-surface rounded-3xl border border-line p-12 text-center space-y-3">

              <p className="text-base font-bold text-ink">
                Nenhum produto encontrado
              </p>

              <p className="text-xs text-ink-soft">
                Tente ajustar os filtros ou o termo de busca para encontrar o que deseja.
              </p>

              <button
                type="button"
                onClick={limparFiltros}
                className="mt-2 px-4 py-2 rounded-xl bg-brand-500 text-white text-xs font-bold hover:bg-brand-600 transition-all cursor-pointer"
              >
                Limpar todos os filtros
              </button>

            </div>

          ) : (

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

              {produtosFiltrados.map(
                (produto) => {
                  const isFavorito =
                    favoritosIds.includes(
                      produto.id
                    );

                  const categoriaProduto =
                    categorias.find(
                      (categoria) =>
                        Number(categoria.id) ===
                        Number(
                          produto.idCategoria
                        )
                    );

                  return (

                    <div
                      key={produto.id}
                      className="bg-surface rounded-3xl border border-line overflow-hidden shadow-sm flex flex-col group transition-all hover:shadow-md relative"
                    >

                      {/* FAVORITO */}
                      <button
                        type="button"
                        onClick={() =>
                          toggleFavorito(
                            produto.id
                          )
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

                      {/* FOTO */}
                      <div className="relative h-48 w-full bg-canvas overflow-hidden">

                        <img
                          src={
                            produto.fotoProduto ||
                            "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=400"
                          }
                          alt={produto.nome}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {produto.disponivelParaVenda ===
                          false && (

                          <span className="absolute top-3 left-3 bg-danger/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            Indisponível
                          </span>

                        )}

                      </div>

                      {/* DETALHES */}
                      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">

                        <div className="space-y-1">

                          <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider block">
                            {categoriaProduto?.nome ||
                              "Geral"}
                          </span>

                          <h3 className="font-bold text-sm text-ink line-clamp-1">
                            {produto.nome}
                          </h3>

                          <span className="font-extrabold text-lg text-brand-600 block">
                            R${" "}
                            {Number(
                              produto.preco || 0
                            ).toLocaleString(
                              "pt-BR",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              }
                            )}
                          </span>

                        </div>

                        <div className="pt-3 border-t border-line flex items-center justify-between text-xs text-ink-faint">

                          <div className="flex items-center gap-1.5 truncate">

                            <div className="w-5 h-5 rounded-full bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                              {produto.vendedor?.nome
                                ? produto.vendedor.nome
                                    .charAt(0)
                                    .toUpperCase()
                                : "U"}
                            </div>

                            <span className="truncate">
                              {produto.vendedor?.nome ||
                                "Estudante UFAPE"}
                            </span>

                          </div>

                          <span className="shrink-0">
                            {produto.quantidadeDisponivel ??
                              0}{" "}
                            disp.
                          </span>

                        </div>

                      </div>

                    </div>

                  );
                }
              )}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}