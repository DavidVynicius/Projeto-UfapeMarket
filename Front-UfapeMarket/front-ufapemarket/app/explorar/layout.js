"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ExplorarLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isMounted, setIsMounted] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [emailUsuario, setEmailUsuario] = useState("");
  const [qtdNotificacoes, setQtdNotificacoes] = useState(0);
  const [menuAberto, setMenuAberto] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState("");
  const [termoPesquisa, setTermoPesquisa] = useState("");

  const menuRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
    const usuarioSalvo = localStorage.getItem("usuarioLogado");
    if (usuarioSalvo) {
      try {
        const dados = JSON.parse(usuarioSalvo);
        if (dados.nome) setNomeUsuario(dados.nome);
        if (dados.emailInstitucional) setEmailUsuario(dados.emailInstitucional);
        if (dados.fotoPerfil) setFotoPerfil(dados.fotoPerfil);

        fetch(`http://localhost:8081/notificacoes/usuario/${dados.id}`)
          .then((res) => {
            if (!res.ok) throw new Error("Erro ao buscar notificações");
            return res.json();
          })
          .then((notificacoes) => {
            if (Array.isArray(notificacoes)) {
              const naoLidas = notificacoes.filter((n) => !n.lida).length;
              setQtdNotificacoes(naoLidas + 1);
            }
          })
          .catch(() => {
            setQtdNotificacoes(1);
          });
      } catch (e) {
        console.error(e);
      }
    }

    const termoUrl = searchParams.get("termo");
    if (termoUrl) {
      setTermoPesquisa(termoUrl);
    }

    const handleClickFora = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuAberto(false);
      }
    };
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, [searchParams]);

  const handleBuscar = (e) => {
    e.preventDefault();
    if (termoPesquisa.trim()) {
      router.push(
        `/explorar/busca?termo=${encodeURIComponent(termoPesquisa.trim())}`,
      );
    } else {
      router.push(`/explorar/busca`);
    }
  };

  const handleSair = () => {
    localStorage.removeItem("usuarioLogado");
    localStorage.removeItem("tokenJwt");
    router.push("/");
  };

  const inicial = nomeUsuario ? nomeUsuario.charAt(0).toUpperCase() : "U";
  const isActive = (path) => pathname === path;

  // Evita disparar erro de hidratação enquanto o componente não monta no cliente
  if (!isMounted) {
    return <div className="min-h-screen bg-canvas" />;
  }

  return (
    <div className="min-h-screen bg-canvas text-ink font-sans flex w-full relative">
      {/* SIDEBAR ESQUERDA FIXA */}
      <aside className="w-64 bg-surface border-r border-line p-6 flex-col justify-between shrink-0 hidden lg:flex h-screen fixed top-0 left-0 z-50 overflow-y-auto">
        <div className="space-y-6">
          <Link
            href="/explorar"
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-brand-500 text-white font-black flex items-center justify-center text-lg shrink-0 group-hover:bg-brand-600 transition-all shadow-sm">
              U
            </div>
            <span className="font-bold text-lg tracking-tight text-brand-500 group-hover:text-brand-600 transition-colors">
              UFAPE <span className="text-ink">Market</span>
            </span>
          </Link>

          <Link href="/explorar/publicar" className="block w-full">
            <button className="w-full py-3 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer">
              <span className="text-lg font-bold">+</span>
              <span>Publicar produto</span>
            </button>
          </Link>

          <nav className="space-y-1">
            <Link
              href="/explorar"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                isActive("/explorar")
                  ? "font-semibold bg-brand-50 text-brand-700"
                  : "font-medium text-ink-soft hover:bg-canvas"
              }`}
            >
              <svg
                className="w-5 h-5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Início
            </Link>

            <Link
              href="/explorar/busca"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                isActive("/explorar/busca")
                  ? "font-semibold bg-brand-50 text-brand-700"
                  : "font-medium text-ink-soft hover:bg-canvas"
              }`}
            >
              <svg
                className="w-5 h-5 shrink-0"
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
              Explorar
            </Link>

            <Link
              href="/explorar/categorias"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                isActive("/explorar/categorias")
                  ? "font-semibold bg-brand-50 text-brand-700"
                  : "font-medium text-ink-soft hover:bg-canvas"
              }`}
            >
              <svg
                className="w-5 h-5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              Categorias
            </Link>

            <Link
              href="/explorar/favoritos"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                isActive("/explorar/favoritos")
                  ? "font-semibold bg-brand-50 text-brand-700"
                  : "font-medium text-ink-soft hover:bg-canvas"
              }`}
            >
              <svg
                className="w-5 h-5 shrink-0"
                fill="none"
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
              Favoritos
            </Link>

            <Link
              href="/explorar/conversas"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                isActive("/explorar/conversas")
                  ? "font-semibold bg-brand-50 text-brand-700"
                  : "font-medium text-ink-soft hover:bg-canvas"
              }`}
            >
              <svg
                className="w-5 h-5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 4.418 9 8z"
                />
              </svg>
              Conversas
            </Link>
          </nav>

          <div className="pt-4 border-t border-line">
            <span className="text-[11px] font-bold text-ink-faint uppercase tracking-wider px-3 block mb-2">
              GESTÃO
            </span>
            <nav className="space-y-1">
              <Link
                href="/explorar/meus-produtos"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  isActive("/explorar/meus-produtos")
                    ? "font-semibold bg-brand-50 text-brand-700"
                    : "font-medium text-ink-soft hover:bg-canvas"
                }`}
              >
                <svg
                  className="w-5 h-5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                Meus produtos
              </Link>
              <Link
                href="/explorar/minhas-vendas"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  isActive("/explorar/minhas-vendas")
                    ? "font-semibold bg-brand-50 text-brand-700"
                    : "font-medium text-ink-soft hover:bg-canvas"
                }`}
              >
                <svg
                  className="w-5 h-5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Minhas vendas
              </Link>
              <Link
                href="/explorar/minhas-compras"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  isActive("/explorar/minhas-compras")
                    ? "font-semibold bg-brand-50 text-brand-700"
                    : "font-medium text-ink-soft hover:bg-canvas"
                }`}
              >
                <svg
                  className="w-5 h-5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                Minhas compras
              </Link>
            </nav>
          </div>
        </div>

        <div className="bg-brand-500 text-white p-4 rounded-2xl space-y-1 mt-6 shrink-0">
          <p className="font-bold text-xs">Feito por estudantes</p>
          <p className="text-[11px] text-brand-100 leading-tight">
            para estudantes da UFAPE. 💚
          </p>
        </div>
      </aside>

      {/* ÁREA DIREITA */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <header className="bg-surface border-b border-line px-6 py-4 flex items-center justify-between gap-4 sticky top-0 z-40">
          <div className="flex-1 max-w-[200px] hidden sm:block"></div>

          <div className="flex-1 max-w-lg mx-auto">
            <form onSubmit={handleBuscar} className="relative">
              <input
                type="text"
                value={termoPesquisa}
                onChange={(e) => setTermoPesquisa(e.target.value)}
                placeholder="O que você está procurando?"
                className="w-full pl-10 pr-4 py-2 rounded-full border border-line bg-canvas text-ink text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all placeholder:text-ink-faint"
              />
              <button
                type="submit"
                className="absolute left-3.5 top-2.5 text-ink-faint hover:text-brand-600"
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>
          </div>

          <div className="flex items-center gap-3 justify-end flex-1 max-w-[250px]">
            <Link href="/explorar/publicar">
              <button className="w-9 h-9 rounded-full bg-canvas hover:bg-line flex items-center justify-center font-bold text-ink-soft transition-all cursor-pointer">
                +
              </button>
            </Link>

            <div className="relative">
              <Link href="/explorar/notificacoes">
                <button
                  className="w-9 h-9 rounded-full bg-canvas hover:bg-line flex items-center justify-center text-ink-soft transition-all cursor-pointer relative"
                  title="Notificações"
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
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </button>
              </Link>

              {qtdNotificacoes > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center shadow-xs pointer-events-none animate-in zoom-in">
                  {qtdNotificacoes}
                </span>
              )}
            </div>

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuAberto(!menuAberto)}
                className="w-9 h-9 rounded-full bg-brand-500 text-white font-bold text-sm flex items-center justify-center shadow-sm cursor-pointer border border-brand-600 overflow-hidden hover:opacity-90 transition-all shrink-0 focus:outline-none"
              >
                {fotoPerfil ? (
                  <img
                    src={fotoPerfil}
                    alt="Perfil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{inicial}</span>
                )}
              </button>

              {menuAberto && (
                <div className="absolute right-0 mt-3 w-72 bg-surface rounded-3xl border border-line shadow-xl py-3 z-50">
                  <div className="px-4 pb-3 border-b border-line flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-brand-500 text-white font-bold flex items-center justify-center overflow-hidden shrink-0 border border-brand-600">
                      {fotoPerfil ? (
                        <img
                          src={fotoPerfil}
                          alt="Perfil"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{inicial}</span>
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-bold text-sm text-ink truncate">
                        {nomeUsuario || "Estudante UFAPE"}
                      </p>
                      <p className="text-xs text-ink-faint truncate">
                        {emailUsuario || "estudante@ufape.edu.br"}
                      </p>
                    </div>
                  </div>

                  <div className="py-2 text-sm text-ink-soft space-y-0.5">
                    <Link
                      href="/explorar/perfil"
                      onClick={() => setMenuAberto(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-canvas font-medium text-ink"
                    >
                      Meu perfil
                    </Link>
                    <Link
                      href="/explorar/perfil/editar"
                      onClick={() => setMenuAberto(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-canvas font-medium text-ink"
                    >
                      Editar perfil
                    </Link>
                  </div>

                  <div className="pt-2 mt-1 border-t border-line px-2">
                    <button
                      onClick={handleSair}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-danger-soft text-danger rounded-2xl font-semibold text-sm cursor-pointer"
                    >
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-6 md:p-8 space-y-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
