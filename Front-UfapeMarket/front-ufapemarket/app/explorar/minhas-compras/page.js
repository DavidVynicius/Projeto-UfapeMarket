"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function MinhasComprasPage() {
  const [compras, setCompras] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [compraDetalhe, setCompraDetalhe] = useState(null);
  const [compraAvaliar, setCompraAvaliar] = useState(null);
  const [estrelas, setEstrelas] = useState(5);
  const [comentario, setComentario] = useState("");

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuarioLogado");
    if (usuarioSalvo) {
      try {
        const dados = JSON.parse(usuarioSalvo);
        const usuarioId = dados.id;

        // Busca as compras reais do usuário no backend Spring Boot
        fetch(`http://localhost:8081/compras/comprador/${usuarioId}`)
          .then((res) => {
            if (!res.ok) throw new Error("Erro ao buscar compras");
            return res.json();
          })
          .then((data) => {
            setCompras(Array.isArray(data) ? data : []);
            setCarregando(false);
          })
          .catch((err) => {
            console.warn(
              "Endpoint de compras não encontrado. Exibindo lista vazia.",
            );
            setCompras([]);
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

  const enviarAvaliacao = (e) => {
    e.preventDefault();
    if (!compraAvaliar) return;

    // Atualiza o status localmente para avaliado
    setCompras(
      compras.map((c) =>
        c.id === compraAvaliar.id ? { ...c, avaliado: true } : c,
      ),
    );
    alert("Avaliação enviada com sucesso!");
    setCompraAvaliar(null);
    setComentario("");
    setEstrelas(5);
  };

  return (
    <div className="space-y-6 pb-12 relative">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-2xl font-extrabold text-ink">Minhas compras</h1>
        <p className="text-sm text-ink-soft">
          {compras.length}{" "}
          {compras.length === 1 ? "compra realizada." : "compras realizadas."}
        </p>
      </div>

      {carregando ? (
        <div className="text-center py-16 text-ink-faint">
          Carregando suas compras...
        </div>
      ) : compras.length === 0 ? (
        <div className="bg-surface rounded-3xl border border-line p-12 text-center space-y-3 shadow-sm max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-500 text-2xl flex items-center justify-center mx-auto">
            🛍️
          </div>
          <div className="space-y-1">
            <p className="text-base font-bold text-ink">
              Nenhuma compra registrada
            </p>
            <p className="text-xs text-ink-soft">
              Os produtos que você comprar aparecerão aqui.
            </p>
          </div>
          <Link
            href="/explorar/busca"
            className="inline-block px-5 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs"
          >
            Explorar produtos
          </Link>
        </div>
      ) : (
        <div className="space-y-4 max-w-4xl">
          {compras.map((compra) => {
            const produtoId = compra.produto?.id || compra.produtoId;
            const nomeProduto =
              compra.produto?.nome || compra.nomeProduto || "Produto";
            const fotoProduto =
              compra.produto?.fotoProduto ||
              compra.fotoProduto ||
              "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=300";
            const nomeVendedor =
              compra.produto?.vendedor?.nome ||
              compra.vendedorNome ||
              "Estudante UFAPE";
            const quantidade = compra.quantidade || 1;
            const dataCompra = compra.data || "Recentemente";
            const precoTotal =
              compra.total ||
              (compra.produto?.preco ? compra.produto.preco * quantidade : 0);

            return (
              <div
                key={compra.id}
                className="bg-surface rounded-3xl border border-line p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all"
              >
                {/* Informações do Produto (Com link direto para a página do produto) */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <Link
                    href={`/explorar/produtos/${produtoId}`}
                    className="shrink-0 group"
                  >
                    <img
                      src={fotoProduto}
                      alt={nomeProduto}
                      className="w-16 h-16 rounded-2xl object-cover border border-line group-hover:opacity-90 transition-opacity"
                      title="Ver página do produto"
                    />
                  </Link>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        {compra.status || "Concluída"}
                      </span>
                      <span className="text-xs text-ink-faint">
                        {dataCompra}
                      </span>
                    </div>

                    <Link
                      href={`/explorar/produtos/${produtoId}`}
                      className="block"
                    >
                      <h3
                        className="font-bold text-base text-ink truncate max-w-md hover:text-brand-600 transition-colors"
                        title="Ver página do produto"
                      >
                        {nomeProduto}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-2 text-xs text-ink-soft">
                      <div className="w-5 h-5 rounded-full bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {nomeVendedor.charAt(0)}
                      </div>
                      <span>{nomeVendedor}</span>
                      <span>•</span>
                      <span>{quantidade} un.</span>
                    </div>
                  </div>
                </div>

                {/* Preço e Ações */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-line">
                  <span className="font-extrabold text-base text-brand-600 sm:mr-4">
                    R${" "}
                    {precoTotal.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setCompraDetalhe({
                          ...compra,
                          produtoNome: nomeProduto,
                          produtoFoto: fotoProduto,
                          vendedorNome: nomeVendedor,
                          precoTotal,
                        })
                      }
                      className="px-3.5 py-2 rounded-xl border border-line bg-canvas hover:bg-line text-ink font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
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

                    <button
                      onClick={() =>
                        !compra.avaliado &&
                        setCompraAvaliar({
                          ...compra,
                          vendedorNome: nomeVendedor,
                        })
                      }
                      disabled={compra.avaliado}
                      className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        compra.avaliado
                          ? "border-line bg-canvas text-ink-faint cursor-default"
                          : "border-brand-500/30 bg-brand-50 hover:bg-brand-100 text-brand-700 cursor-pointer"
                      }`}
                    >
                      ⭐ {compra.avaliado ? "Avaliado" : "Avaliar"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* POPOUT / MODAL DE DETALHES DA COMPRA */}
      {compraDetalhe && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-surface w-full max-w-lg rounded-3xl border border-line shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 relative">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <h2 className="text-xl font-extrabold text-ink">
                Detalhes da venda
              </h2>
              <button
                onClick={() => setCompraDetalhe(null)}
                className="w-8 h-8 rounded-full bg-canvas hover:bg-line text-ink-soft flex items-center justify-center transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-4 bg-canvas/50 p-4 rounded-2xl border border-line">
              <img
                src={compraDetalhe.produtoFoto}
                alt={compraDetalhe.produtoNome}
                className="w-16 h-16 rounded-xl object-cover border border-line shrink-0"
              />
              <div className="space-y-1">
                <h3 className="font-bold text-base text-ink">
                  {compraDetalhe.produtoNome}
                </h3>
                <span className="inline-block px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                  {compraDetalhe.status || "Concluída"}
                </span>
              </div>
            </div>

            <div className="divide-y divide-line text-sm space-y-3 pt-2">
              <div className="flex justify-between py-2.5">
                <span className="text-ink-soft font-medium">Vendedor</span>
                <span className="font-bold text-ink">
                  {compraDetalhe.vendedorNome}
                </span>
              </div>

              <div className="flex justify-between py-2.5">
                <span className="text-ink-soft font-medium">Quantidade</span>
                <span className="font-bold text-ink">
                  {compraDetalhe.quantidade || 1}
                </span>
              </div>

              <div className="flex justify-between py-2.5">
                <span className="text-ink-soft font-medium">
                  Preço unitário
                </span>
                <span className="font-bold text-ink">
                  R${" "}
                  {(
                    compraDetalhe.precoTotal / (compraDetalhe.quantidade || 1)
                  ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between py-2.5">
                <span className="text-ink-soft font-medium">Data</span>
                <span className="font-bold text-ink">
                  {compraDetalhe.data || "Recentemente"}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-line flex items-center justify-between">
              <span className="font-bold text-base text-ink">Total</span>
              <span className="font-extrabold text-xl text-brand-600">
                R${" "}
                {compraDetalhe.precoTotal.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* POPOUT / MODAL DE AVALIAR VENDEDOR */}
      {compraAvaliar && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <form
            onSubmit={enviarAvaliacao}
            className="bg-surface w-full max-w-lg rounded-3xl border border-line shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 relative"
          >
            <div className="flex items-center justify-between border-b border-line pb-4">
              <h2 className="text-xl font-extrabold text-ink">
                Avaliar vendedor
              </h2>
              <button
                type="button"
                onClick={() => setCompraAvaliar(null)}
                className="w-8 h-8 rounded-full bg-canvas hover:bg-line text-ink-soft flex items-center justify-center transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-center space-y-3 pt-2">
              <p className="text-xs font-bold text-ink-soft uppercase tracking-wider">
                Avalie {compraAvaliar.vendedorNome}
              </p>

              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setEstrelas(star)}
                    className="text-3xl focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                  >
                    {star <= estrelas ? "⭐" : "☆"}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink uppercase tracking-wider block">
                Comentário
              </label>
              <textarea
                rows="4"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Conte como foi sua experiência..."
                className="w-full px-4 py-3 rounded-2xl border border-line bg-canvas text-ink text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all resize-none placeholder:text-ink-faint"
                required
              ></textarea>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
              <button
                type="button"
                onClick={() => setCompraAvaliar(null)}
                className="px-5 py-2.5 rounded-2xl border border-line bg-canvas text-ink-soft hover:bg-line font-semibold text-xs transition-all cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                Enviar avaliação
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
