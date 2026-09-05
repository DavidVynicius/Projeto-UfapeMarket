"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function MinhasVendasPage() {
  const [vendas, setVendas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [vendaSelecionada, setVendaSelecionada] = useState(null);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuarioLogado");
    if (usuarioSalvo) {
      try {
        const dados = JSON.parse(usuarioSalvo);
        const usuarioId = dados.id;

        fetch(`http://localhost:8081/vendas/vendedor/${usuarioId}`)
          .then((res) => {
            if (!res.ok) throw new Error("Erro ao buscar vendas");
            return res.json();
          })
          .then((data) => {
            setVendas(Array.isArray(data) ? data : []);
            setCarregando(false);
          })
          .catch((err) => {
            console.warn(
              "Endpoint de vendas não encontrado ou backend offline. Exibindo estado vazio.",
            );
            // Se a rota falhar ou não existir, define como array vazio [ ] para mostrar a tela de "Nenhuma venda registrada"
            setVendas([]);
            setCarregando(false);
          });
      } catch (e) {
        console.error(e);
        setVendas([]);
        setCarregando(false);
      }
    } else {
      setCarregando(false);
    }
  }, []);

  return (
    <div className="space-y-6 pb-12 relative">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-2xl font-extrabold text-ink">Minhas vendas</h1>
        <p className="text-sm text-ink-soft">
          {vendas.length}{" "}
          {vendas.length === 1 ? "venda registrada." : "vendas registradas."}
        </p>
      </div>

      {carregando ? (
        <div className="text-center py-16 text-ink-faint">
          Carregando suas vendas...
        </div>
      ) : vendas.length === 0 ? (
        /* SE NÃO TIVER VENDAS, MOSTRA ESTE BLOCO VAZIO */
        <div className="bg-surface rounded-3xl border border-line p-12 text-center space-y-4 max-w-lg mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-500 text-2xl flex items-center justify-center mx-auto">
            💰
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base text-ink">
              Nenhuma venda registrada
            </h3>
            <p className="text-xs text-ink-soft">
              As vendas dos seus produtos aparecerão aqui assim que forem
              efetuadas por outros estudantes.
            </p>
          </div>
          <Link
            href="/explorar/meus-produtos"
            className="inline-block px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs transition-all shadow-sm"
          >
            Ver meus produtos anunciados
          </Link>
        </div>
      ) : (
        /* SE TIVER VENDAS, MOSTRA A TABELA */
        <div className="bg-surface rounded-3xl border border-line shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-line text-[11px] font-bold text-ink-faint uppercase tracking-wider bg-canvas/50">
                  <th className="py-4 px-6">Produto</th>
                  <th className="py-4 px-6">Comprador</th>
                  <th className="py-4 px-6">Qtd</th>
                  <th className="py-4 px-6">Data</th>
                  <th className="py-4 px-6">Total</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-sm">
                {vendas.map((venda) => (
                  <tr
                    key={venda.id}
                    className="hover:bg-canvas/50 transition-all"
                  >
                    {/* Produto */}
                    <td className="py-4 px-6 flex items-center gap-3">
                      <img
                        src={
                          venda.produto?.fotoProduto ||
                          "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=300"
                        }
                        alt={venda.produto?.nome || "Produto"}
                        className="w-10 h-10 rounded-xl object-cover border border-line shrink-0"
                      />
                      <span className="font-bold text-ink truncate max-w-xs">
                        {venda.produto?.nome || "Produto"}
                      </span>
                    </td>

                    {/* Comprador */}
                    <td className="py-4 px-6 text-ink-soft font-medium">
                      {venda.comprador?.nome || "Estudante"}
                    </td>

                    {/* Quantidade */}
                    <td className="py-4 px-6 text-ink-soft">
                      {venda.quantidade || 1}
                    </td>

                    {/* Data */}
                    <td className="py-4 px-6 text-ink-faint text-xs">
                      {venda.data || "Recentemente"}
                    </td>

                    {/* Total */}
                    <td className="py-4 px-6 font-extrabold text-brand-600">
                      R${" "}
                      {(
                        venda.total ||
                        venda.produto?.preco ||
                        0
                      ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </td>

                    {/* Status (Badge) */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          venda.status === "Concluída"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {venda.status || "Pendente"}
                      </span>
                    </td>

                    {/* Ação (Ver Modal) */}
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setVendaSelecionada(venda)}
                        className="px-3 py-1.5 rounded-xl border border-line bg-canvas hover:bg-line text-ink font-semibold text-xs inline-flex items-center gap-1.5 transition-all cursor-pointer"
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* POPOUT / MODAL DE DETALHES DA VENDA */}
      {vendaSelecionada && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-surface w-full max-w-lg rounded-3xl border border-line shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 relative">
            {/* Cabeçalho do Modal */}
            <div className="flex items-center justify-between border-b border-line pb-4">
              <h2 className="text-xl font-extrabold text-ink">
                Detalhes da venda
              </h2>
              <button
                onClick={() => setVendaSelecionada(null)}
                className="w-8 h-8 rounded-full bg-canvas hover:bg-line text-ink-soft flex items-center justify-center transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Produto e Status no Modal */}
            <div className="flex items-center gap-4 bg-canvas/50 p-4 rounded-2xl border border-line">
              <img
                src={
                  vendaSelecionada.produto?.fotoProduto ||
                  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=300"
                }
                alt={vendaSelecionada.produto?.nome || "Produto"}
                className="w-16 h-16 rounded-xl object-cover border border-line shrink-0"
              />
              <div className="space-y-1">
                <h3 className="font-bold text-base text-ink">
                  {vendaSelecionada.produto?.nome || "Produto"}
                </h3>
                <span
                  className={`inline-block px-3 py-0.5 rounded-full text-xs font-semibold ${
                    vendaSelecionada.status === "Concluída"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {vendaSelecionada.status || "Pendente"}
                </span>
              </div>
            </div>

            {/* Informações Detalhadas */}
            <div className="divide-y divide-line text-sm space-y-3 pt-2">
              <div className="flex justify-between py-2.5">
                <span className="text-ink-soft font-medium">Comprador</span>
                <span className="font-bold text-ink">
                  {vendaSelecionada.comprador?.nome || "Estudante"}
                </span>
              </div>

              <div className="flex justify-between py-2.5">
                <span className="text-ink-soft font-medium">Quantidade</span>
                <span className="font-bold text-ink">
                  {vendaSelecionada.quantidade || 1}
                </span>
              </div>

              <div className="flex justify-between py-2.5">
                <span className="text-ink-soft font-medium">
                  Preço unitário
                </span>
                <span className="font-bold text-ink">
                  R${" "}
                  {(vendaSelecionada.produto?.preco || 0).toLocaleString(
                    "pt-BR",
                    { minimumFractionDigits: 2 },
                  )}
                </span>
              </div>

              <div className="flex justify-between py-2.5">
                <span className="text-ink-soft font-medium">Data</span>
                <span className="font-bold text-ink">
                  {vendaSelecionada.data || "Recentemente"}
                </span>
              </div>
            </div>

            {/* Total Destacado no Rodapé do Modal */}
            <div className="pt-4 border-t border-line flex items-center justify-between">
              <span className="font-bold text-base text-ink">Total</span>
              <span className="font-extrabold text-xl text-brand-600">
                R${" "}
                {(
                  vendaSelecionada.total ||
                  vendaSelecionada.produto?.preco ||
                  0
                ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
