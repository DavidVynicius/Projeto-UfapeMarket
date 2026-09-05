"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PerfilPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState(null);
  const [meusProdutos, setMeusProdutos] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuarioLogado");
    if (usuarioSalvo) {
      try {
        const dados = JSON.parse(usuarioSalvo);
        setUsuario(dados);

        // Busca os produtos do backend e filtra os do usuário logado
        fetch("http://localhost:8081/produtos")
          .then((res) => res.json())
          .then((produtos) => {
            const produtosDoUsuario = produtos.filter(
              (p) => p.vendedor?.id === dados.id || p.idVendedor === dados.id,
            );
            setMeusProdutos(produtosDoUsuario);
          })
          .catch((err) => console.error("Erro ao buscar produtos:", err));
      } catch (e) {
        console.error("Erro ao parsear usuário:", e);
      }
    }
    setCarregando(false);
  }, []);

  const handleExcluirConta = async () => {
    if (!usuario?.id) return;

    if (
      confirm(
        "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.",
      )
    ) {
      try {
        const res = await fetch(
          `http://localhost:8081/usuarios/${usuario.id}`,
          {
            method: "DELETE",
          },
        );

        if (res.ok) {
          localStorage.removeItem("usuarioLogado");
          localStorage.removeItem("tokenJwt");
          alert("Conta excluída com sucesso.");
          router.push("/");
        } else {
          alert("Erro ao excluir conta.");
        }
      } catch (e) {
        console.error(e);
        alert("Erro de conexão com o servidor.");
      }
    }
  };

  if (carregando) {
    return (
      <div className="text-center py-12 text-ink-faint">
        Carregando perfil...
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-ink-soft">
          Você precisa estar logado para ver seu perfil.
        </p>
        <Link
          href="/"
          className="px-4 py-2 bg-brand-500 text-white rounded-xl font-bold text-sm"
        >
          Fazer login
        </Link>
      </div>
    );
  }

  const inicial = usuario.nome ? usuario.nome.charAt(0).toUpperCase() : "U";

  return (
    <div className="space-y-8 pb-16">
      {/* BANNER DO PERFIL */}
      <div className="relative">
        <div
          className="h-48 w-full rounded-3xl shadow-sm overflow-hidden bg-brand-500"
          style={
            usuario?.bannerUrl
              ? {
                  backgroundImage: `url(${usuario.bannerUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : {}
          }
        ></div>

        {/* CARD DE INFORMAÇÕES DO PERFIL (Sobreposto ao Banner) */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-16">
          <div className="bg-surface rounded-3xl border border-line p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              {/* Foto / Incial e Dados Principais */}
              <div className="flex items-end gap-5">
                <div className="w-24 h-24 rounded-full bg-brand-500 text-white text-3xl font-bold flex items-center justify-center border-4 border-surface shadow-md overflow-hidden shrink-0">
                  {usuario.fotoPerfil ? (
                    <img
                      src={usuario.fotoPerfil}
                      alt={usuario.nome}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{inicial}</span>
                  )}
                </div>

                <div className="space-y-1">
                  <h1 className="text-2xl font-extrabold text-ink">
                    {usuario.nome}
                  </h1>
                  <p className="text-sm text-ink-soft font-medium">
                    {usuario.curso || "Estudante UFAPE"}
                  </p>

                  {/* Avaliação */}
                  <div className="flex items-center gap-1.5 text-xs text-amber-500 font-semibold pt-0.5">
                    <span>⭐⭐⭐⭐⭐</span>
                    <span className="text-ink">5.0</span>
                    <span className="text-ink-faint">(0 avaliações)</span>
                  </div>
                </div>
              </div>

              {/* Botões de Ação do Perfil */}
              <div className="flex items-center gap-3">
                <Link
                  href="/explorar/perfil/editar"
                  className="px-4 py-2.5 rounded-xl border border-line bg-canvas hover:bg-line text-ink font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <svg
                    className="w-4 h-4 text-ink-soft"
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
                  Editar perfil
                </Link>

                <button
                  onClick={handleExcluirConta}
                  className="px-4 py-2.5 rounded-xl border border-danger/30 bg-danger-soft hover:bg-danger/10 text-danger font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <svg
                    className="w-4 h-4"
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
                  Excluir conta
                </button>
              </div>
            </div>

            {/* Biografia (Só aparece se o usuário tiver preenchido) */}
            {usuario.biografia && (
              <p className="text-sm text-ink-soft leading-relaxed max-w-3xl">
                {usuario.biografia}
              </p>
            )}

            {/* Detalhes de Rodapé do Card */}
            <div className="pt-4 border-t border-line flex flex-wrap items-center gap-6 text-xs text-ink-faint font-medium">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {usuario.emailInstitucional}
              </div>

              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 14l9-5-9-5-9 5 9 5z"
                  />
                </svg>
                {usuario.curso || "Não informado"}
              </div>

              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Membro desde 2026
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO: MEUS PRODUTOS */}
      <div className="max-w-5xl mx-auto space-y-4 pt-4 px-4 sm:px-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">
            Meus produtos{" "}
            <span className="text-xs font-normal text-ink-faint">
              ({meusProdutos.length})
            </span>
          </h2>
        </div>

        {meusProdutos.length === 0 ? (
          <div className="bg-surface rounded-2xl border border-line p-8 text-center space-y-3">
            <p className="text-sm text-ink-soft">
              Você ainda não anunciou nenhum produto.
            </p>
            <Link
              href="/explorar/publicar"
              className="inline-block px-4 py-2 rounded-xl bg-brand-500 text-white text-xs font-bold hover:bg-brand-600 transition-all"
            >
              Publicar meu primeiro produto
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {meusProdutos.map((produto) => (
              <div
                key={produto.id}
                className="bg-surface rounded-2xl border border-line overflow-hidden shadow-sm flex flex-col group"
              >
                <div className="h-40 w-full bg-canvas relative overflow-hidden">
                  <img
                    src={
                      produto.fotoProduto ||
                      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=400"
                    }
                    alt={produto.nome}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider block">
                      {produto.categoria?.nome || "Geral"}
                    </span>
                    <h3 className="font-bold text-sm text-ink line-clamp-1">
                      {produto.nome}
                    </h3>
                    <span className="font-extrabold text-base text-brand-600 block mt-1">
                      R${" "}
                      {produto.preco?.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-line flex items-center justify-between text-xs text-ink-faint">
                    <span>{produto.quantidadeDisponivel} disp.</span>
                    <span className="text-brand-600 font-semibold">
                      {produto.turnoDisponibilidade || "Integral"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SEÇÃO: AVALIAÇÕES */}
      <div className="max-w-5xl mx-auto space-y-4 pt-4 px-4 sm:px-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">
            Avaliações{" "}
            <span className="text-xs font-normal text-ink-faint">
              ({avaliacoes.length})
            </span>
          </h2>
        </div>

        {avaliacoes.length === 0 ? (
          <div className="bg-surface rounded-2xl border border-line p-8 text-center">
            <p className="text-sm text-ink-soft">
              Você ainda não recebeu nenhuma avaliação.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Renderização das avaliações quando houver */}
          </div>
        )}
      </div>
    </div>
  );
}
