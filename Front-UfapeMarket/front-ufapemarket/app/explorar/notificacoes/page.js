"use client";

import { useState, useEffect } from "react";

export default function NotificacoesPage() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState("todas"); // 'todas' ou 'nao-lidas'

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuarioLogado");
    if (usuarioSalvo) {
      try {
        const dados = JSON.parse(usuarioSalvo);
        const usuarioId = dados.id;

        // Busca as notificações reais do banco de dados Spring Boot
        fetch(`http://localhost:8081/notificacoes/usuario/${usuarioId}`)
          .then((res) => {
            if (!res.ok) throw new Error("Erro ao buscar notificações");
            return res.json();
          })
          .then((data) => {
            // Garante dados reais do banco e adiciona 1 notificação de teste sinalizada
            const notificacaoTeste = {
              id: "teste-999",
              tipo: "estoque",
              titulo: "Verificação de estoque (Notificação de Teste)",
              descricao:
                "Esta é uma notificação de teste do sistema para verificar seus estoques.",
              data: "2026-09-05 08:00",
              lida: false,
              isTeste: true,
            };

            const listaReal = Array.isArray(data) ? data : [];
            setNotificacoes([notificacaoTeste, ...listaReal]);
            setCarregando(false);
          })
          .catch((err) => {
            console.warn(
              "Endpoint de notificações não encontrado no backend. Exibindo apenas o aviso de teste.",
            );
            // Fallback caso a rota ainda não exista no backend: exibe apenas a de teste sinalizada
            setNotificacoes([
              {
                id: "teste-999",
                tipo: "estoque",
                titulo: "Verificação de estoque (Notificação de Teste)",
                descricao:
                  "Esta é uma notificação de teste do sistema para verificar seus estoques.",
                data: "2026-09-05 08:00",
                lida: false,
                isTeste: true,
              },
            ]);
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

  const marcarComoLida = (id) => {
    setNotificacoes(
      notificacoes.map((n) => (n.id === id ? { ...n, lida: true } : n)),
    );

    // Opcional: Se for uma notificação real do banco, avisa o backend via PUT/PATCH
    if (id !== "teste-999") {
      fetch(`http://localhost:8081/notificacoes/${id}/lida`, {
        method: "PUT",
      }).catch(() => {});
    }
  };

  const marcarTodasComoLidas = () => {
    setNotificacoes(notificacoes.map((n) => ({ ...n, lida: true })));
  };

  const naoLidasCount = notificacoes.filter((n) => !n.lida).length;

  const notificacoesFiltradas = notificacoes.filter((n) => {
    if (filtro === "nao-lidas") return !n.lida;
    return true;
  });

  const renderIcone = (tipo) => {
    switch (tipo) {
      case "mensagem":
      case "interesse":
        return <span className="text-brand-600 text-lg">💬</span>;
      case "venda":
        return <span className="text-emerald-600 text-lg">💰</span>;
      case "avaliacao":
        return <span className="text-amber-500 text-lg">⭐</span>;
      case "estoque":
        return <span className="text-blue-600 text-lg">📦</span>;
      default:
        return <span className="text-ink text-lg">🔔</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Notificações</h1>
          <p className="text-sm text-ink-soft">
            Você tem <span className="font-bold text-ink">{naoLidasCount}</span>{" "}
            {naoLidasCount === 1
              ? "notificação não lida."
              : "notificações não lidas."}
          </p>
        </div>

        {naoLidasCount > 0 && (
          <button
            onClick={marcarTodasComoLidas}
            className="px-4 py-2.5 rounded-2xl border border-line bg-surface hover:bg-canvas text-ink font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm self-start sm:self-auto"
          >
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
                d="M5 13l4 4L19 7"
              />
            </svg>
            Marcar todas como lidas
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 border-b border-line pb-4">
        <button
          onClick={() => setFiltro("todas")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filtro === "todas"
              ? "bg-brand-500 text-white shadow-sm"
              : "bg-surface text-ink-soft hover:bg-canvas border border-line"
          }`}
        >
          Todas
        </button>

        <button
          onClick={() => setFiltro("nao-lidas")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            filtro === "nao-lidas"
              ? "bg-brand-500 text-white shadow-sm"
              : "bg-surface text-ink-soft hover:bg-canvas border border-line"
          }`}
        >
          Não lidas
          {naoLidasCount > 0 && (
            <span
              className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold ${
                filtro === "nao-lidas"
                  ? "bg-white text-brand-600"
                  : "bg-brand-500 text-white"
              }`}
            >
              {naoLidasCount}
            </span>
          )}
        </button>
      </div>

      {carregando ? (
        <div className="text-center py-16 text-ink-faint">
          Carregando notificações...
        </div>
      ) : notificacoesFiltradas.length === 0 ? (
        <div className="bg-surface rounded-3xl border border-line p-12 text-center space-y-2 shadow-sm">
          <p className="text-base font-bold text-ink">
            Nenhuma notificação por aqui
          </p>
          <p className="text-xs text-ink-soft">
            Você está com todas as novidades em dia!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notificacoesFiltradas.map((notif) => (
            <div
              key={notif.id}
              onClick={() => !notif.lida && marcarComoLida(notif.id)}
              className={`p-4 sm:p-5 rounded-3xl border transition-all flex items-start justify-between gap-4 shadow-sm cursor-pointer ${
                !notif.lida
                  ? "bg-emerald-50/30 border-brand-300/60 hover:border-brand-500"
                  : "bg-surface border-line hover:border-ink-faint/40 opacity-80"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-canvas border border-line flex items-center justify-center shrink-0 mt-0.5">
                  {renderIcone(notif.tipo)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-ink">
                      {notif.titulo}
                    </h3>
                    {notif.isTeste && (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Teste
                      </span>
                    )}
                    {!notif.lida && (
                      <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                    )}
                  </div>
                  <p className="text-xs text-ink-soft leading-relaxed">
                    {notif.descricao}
                  </p>
                  <p className="text-[11px] text-ink-faint pt-0.5">
                    {notif.data}
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center self-center">
                {!notif.lida ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      marcarComoLida(notif.id);
                    }}
                    title="Marcar como lida"
                    className="w-8 h-8 rounded-full bg-surface border border-line hover:bg-brand-50 text-brand-600 flex items-center justify-center transition-all cursor-pointer shadow-xs"
                  >
                    ✓
                  </button>
                ) : (
                  <span className="text-[10px] font-semibold text-ink-faint">
                    Lida
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
