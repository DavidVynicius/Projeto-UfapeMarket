"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditarPerfilPage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [curso, setCurso] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [biografia, setBiografia] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [senha, setSenha] = useState("");
  const [usuarioCompleto, setUsuarioCompleto] = useState(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuarioLogado");
    if (usuarioSalvo) {
      try {
        const dados = JSON.parse(usuarioSalvo);
        setUsuarioCompleto(dados);
        setNome(dados.nome || "");
        setEmail(dados.emailInstitucional || dados.email || "");
        setCurso(dados.curso || "");
        setDataNascimento(dados.dataNascimento || "");
        setBiografia(dados.biografia || "");
        setFotoPerfil(dados.fotoPerfil || "");
        setBannerUrl(dados.bannerUrl || "");
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usuarioCompleto?.id) return;

    setCarregando(true);

    // Usa a senha nova se preenchida, senão mantém a senha que já estava salva no objeto
    const senhaFinal = senha.trim() !== "" ? senha : usuarioCompleto.senha;

    const dadosAtualizados = {
      nome,
      emailInstitucional: email,
      senha: senhaFinal,
      curso,
      dataNascimento: dataNascimento || null,
      fotoPerfil: fotoPerfil || null,
      biografia: biografia || null,
      bannerUrl: bannerUrl || null,
    };

    try {
      const response = await fetch(
        `http://localhost:8081/usuarios/${usuarioCompleto.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dadosAtualizados),
        },
      );

      if (response.ok) {
        const usuarioRetornado = await response.json();
        // Garante que o bannerUrl e fotoPerfil venham salvos no objeto atualizado
        localStorage.setItem("usuarioLogado", JSON.stringify(usuarioRetornado));
        alert("Perfil atualizado com sucesso!");
        router.push("/explorar/perfil");
      } else {
        const erroTxt = await response.text();
        alert("Erro ao atualizar perfil: " + erroTxt);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Não foi possível conectar ao servidor Spring Boot.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div>
        <Link
          href="/explorar/perfil"
          className="text-xs font-semibold text-brand-600 hover:underline"
        >
          &lt; Voltar para o perfil
        </Link>
        <h1 className="text-2xl font-extrabold text-ink mt-1">Editar perfil</h1>
        <p className="text-sm text-ink-soft">
          Atualize suas informações pessoais e visuais.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-surface p-6 sm:p-8 rounded-3xl border border-line space-y-6 shadow-sm"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-line">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink uppercase tracking-wider">
              URL da Foto de Perfil
            </label>
            <input
              type="url"
              value={fotoPerfil}
              onChange={(e) => setFotoPerfil(e.target.value)}
              placeholder="https://exemplo.com/foto.jpg"
              className="w-full px-4 py-3 rounded-xl border border-line bg-canvas text-ink text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all placeholder:text-ink-faint"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink uppercase tracking-wider">
              URL do Banner do Perfil
            </label>
            <input
              type="url"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              placeholder="https://exemplo.com/banner.jpg"
              className="w-full px-4 py-3 rounded-xl border border-line bg-canvas text-ink text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all placeholder:text-ink-faint"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-ink uppercase tracking-wider">
            Nome completo *
          </label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-line bg-canvas text-ink text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-ink uppercase tracking-wider">
            E-mail institucional *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-line bg-canvas text-ink text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink uppercase tracking-wider">
              Curso *
            </label>
            <input
              type="text"
              value={curso}
              onChange={(e) => setCurso(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-line bg-canvas text-ink text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink uppercase tracking-wider">
              Data de nascimento
            </label>
            <input
              type="date"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-line bg-canvas text-ink text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-ink uppercase tracking-wider">
            Nova senha (deixe em branco para manter a atual)
          </label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="••••••••••••"
            className="w-full px-4 py-3 rounded-xl border border-line bg-canvas text-ink text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all placeholder:text-ink-faint"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-ink uppercase tracking-wider">
            Biografia
          </label>
          <textarea
            rows="3"
            value={biografia}
            onChange={(e) => setBiografia(e.target.value)}
            placeholder="Conte um pouco sobre você..."
            className="w-full px-4 py-3 rounded-xl border border-line bg-canvas text-ink text-sm outline-none focus:ring-2 focus:ring-brand-500/20 transition-all resize-none"
          ></textarea>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-line">
          <button
            type="submit"
            disabled={carregando}
            className="py-3 px-6 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-60"
          >
            {carregando ? "Salvando..." : "Salvar alterações"}
          </button>

          <Link
            href="/explorar/perfil"
            className="px-6 py-3 rounded-2xl border border-line bg-canvas text-ink-soft hover:bg-line font-semibold text-sm transition-all text-center"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
