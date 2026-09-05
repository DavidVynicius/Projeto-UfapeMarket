"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ConversasPage() {
  const router = useRouter();
  const [conversas, setConversas] = useState([]);
  const [conversaAtivaId, setConversaAtivaId] = useState(null);
  const [novoTexto, setNovoTexto] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Busca produtos reais do banco de dados para vincular nas conversas de exemplo
    fetch("http://localhost:8081/produtos")
      .then((res) => res.json())
      .then((produtos) => {
        // Cria conversas dinâmicas baseadas nos produtos reais do banco (se houver)
        const conversasReais = produtos.slice(0, 3).map((prod, index) => ({
          id: prod.id || index + 1,
          vendedorId: prod.vendedor?.id || null,
          nome: prod.vendedor?.nome || "Estudante UFAPE",
          curso: prod.vendedor?.curso || "Ciência da Computação",
          foto:
            prod.vendedor?.fotoPerfil ||
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
          produto: prod.nome,
          preco: prod.preco || 0.0,
          fotoProduto:
            prod.fotoProduto ||
            "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=150",
          horario: "10:30",
          mensagens: [
            {
              remetente: "outro",
              texto: `Olá! Tenho interesse no seu anúncio de ${prod.nome}. Ainda está disponível?`,
              horario: "10:25",
            },
            {
              remetente: "eu",
              texto: "Olá! Sim, está disponível.",
              horario: "10:30",
            },
          ],
        }));

        if (conversasReais.length > 0) {
          setConversas(conversasReais);
          setConversaAtivaId(conversasReais[0].id);
        }
        setCarregando(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar produtos para conversas:", err);
        setCarregando(false);
      });
  }, []);

  const conversaAtual =
    conversas.find((c) => c.id === conversaAtivaId) || conversas[0];

  const enviarMensagem = (e) => {
    e.preventDefault();
    if (!novoTexto.trim() || !conversaAtual) return;

    const mensagemObj = {
      remetente: "eu",
      texto: novoTexto.trim(),
      horario: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setConversas(
      conversas.map((conv) => {
        if (conv.id === conversaAtivaId) {
          return {
            ...conv,
            mensagens: [...conv.mensagens, mensagemObj],
            horario: mensagemObj.horario,
          };
        }
        return conv;
      }),
    );

    setNovoTexto("");
  };

  const lidarComCliquePerfil = (vendedorId) => {
    if (vendedorId) {
      // Se for um usuário real com ID no banco, vai para a rota de perfil dele
      router.push(`/explorar/usuarios/${vendedorId}`);
    } else {
      // Se não for um perfil real cadastrado com ID, avisa o usuário educadamente
      alert(
        "Este contato é um perfil de demonstração e não possui página pública cadastrada.",
      );
    }
  };

  if (carregando) {
    return (
      <div className="text-center py-16 text-ink-faint">
        Carregando conversas...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">Conversas</h1>
        <p className="text-sm text-ink-soft">
          Negocie e tire dúvidas diretamente com outros estudantes.
        </p>
      </div>

      {conversas.length === 0 ? (
        <div className="bg-surface rounded-3xl border border-line p-12 text-center space-y-3">
          <p className="text-base font-bold text-ink">Nenhuma conversa ativa</p>
          <p className="text-xs text-ink-soft">
            Explore os produtos e inicie uma conversa com os vendedores.
          </p>
          <Link
            href="/explorar/busca"
            className="inline-block mt-2 px-4 py-2 bg-brand-500 text-white text-xs font-bold rounded-xl"
          >
            Explorar produtos
          </Link>
        </div>
      ) : (
        <div className="bg-surface rounded-3xl border border-line shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
          {/* LISTA DE CONVERSAS (ESQUERDA) */}
          <div className="lg:col-span-4 border-r border-line flex flex-col bg-surface">
            <div className="p-4 border-b border-line font-bold text-sm text-ink">
              Mensagens
            </div>

            <div className="overflow-y-auto divide-y divide-line flex-1">
              {conversas.map((conv) => {
                const ultimaMsg = conv.mensagens[conv.mensagens.length - 1];
                const ativa = conv.id === conversaAtivaId;

                return (
                  <div
                    key={conv.id}
                    onClick={() => setConversaAtivaId(conv.id)}
                    className={`p-4 flex items-start gap-3 cursor-pointer transition-all ${
                      ativa
                        ? "bg-brand-50/60 border-l-4 border-brand-500"
                        : "hover:bg-canvas"
                    }`}
                  >
                    <img
                      src={conv.foto}
                      alt={conv.nome}
                      className="w-11 h-11 rounded-full object-cover shrink-0 hover:opacity-80 transition-opacity"
                      title="Ver perfil"
                      onClick={(e) => {
                        e.stopPropagation();
                        lidarComCliquePerfil(conv.vendedorId);
                      }}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-sm text-ink truncate">
                          {conv.nome}
                        </p>
                        <span className="text-[11px] text-ink-faint shrink-0">
                          {conv.horario}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-brand-600 truncate">
                        {conv.produto}
                      </p>
                      <p className="text-xs text-ink-soft truncate mt-0.5">
                        {ultimaMsg ? ultimaMsg.texto : ""}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* JANELA DO CHAT (DIREITA) */}
          <div className="lg:col-span-8 flex flex-col bg-canvas/30 justify-between">
            {/* CABEÇALHO DO CHAT */}
            <div className="p-4 bg-surface border-b border-line flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={conversaAtual?.foto}
                  alt={conversaAtual?.nome}
                  className="w-10 h-10 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity border border-line"
                  title="Clique para ver o perfil"
                  onClick={() =>
                    lidarComCliquePerfil(conversaAtual?.vendedorId)
                  }
                />
                <div>
                  <h2
                    className="font-bold text-sm text-ink cursor-pointer hover:text-brand-600 transition-colors"
                    onClick={() =>
                      lidarComCliquePerfil(conversaAtual?.vendedorId)
                    }
                  >
                    {conversaAtual?.nome}
                  </h2>
                  <p className="text-xs text-ink-faint">
                    {conversaAtual?.curso}
                  </p>
                </div>
              </div>

              {/* CARD DO PRODUTO REAL NO TOPO */}
              <div className="hidden sm:flex items-center gap-3 bg-canvas border border-line py-1.5 px-3 rounded-2xl">
                <img
                  src={conversaAtual?.fotoProduto}
                  alt={conversaAtual?.produto}
                  className="w-8 h-8 rounded-xl object-cover"
                />
                <div className="text-xs">
                  <p className="text-[10px] text-ink-faint font-medium">
                    Sobre o produto
                  </p>
                  <p className="font-bold text-ink truncate max-w-[150px]">
                    {conversaAtual?.produto}
                  </p>
                </div>
                <span className="font-extrabold text-sm text-brand-600 ml-2">
                  R${" "}
                  {conversaAtual?.preco?.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>

            {/* MENSAGENS */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1 flex flex-col justify-end">
              {conversaAtual?.mensagens.map((msg, idx) => {
                const souEu = msg.remetente === "eu";

                return (
                  <div
                    key={idx}
                    className={`flex flex-col ${souEu ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-md px-4 py-3 rounded-2xl text-sm shadow-sm ${
                        souEu
                          ? "bg-brand-600 text-white rounded-br-none"
                          : "bg-surface text-ink border border-line rounded-bl-none"
                      }`}
                    >
                      <p className="leading-relaxed">{msg.texto}</p>
                    </div>
                    <span className="text-[10px] text-ink-faint mt-1 px-1">
                      {msg.horario}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* INPUT DE ENVIO */}
            <form
              onSubmit={enviarMensagem}
              className="p-4 bg-surface border-t border-line flex items-center gap-3"
            >
              <input
                type="text"
                value={novoTexto}
                onChange={(e) => setNovoTexto(e.target.value)}
                placeholder="Digite uma mensagem..."
                className="flex-1 px-4 py-3 rounded-full border border-line bg-canvas text-ink text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all placeholder:text-ink-faint"
              />

              <button
                type="submit"
                className="w-11 h-11 rounded-full bg-brand-500 hover:bg-brand-600 text-white flex items-center justify-center transition-all shadow-sm cursor-pointer shrink-0 active:scale-95"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
