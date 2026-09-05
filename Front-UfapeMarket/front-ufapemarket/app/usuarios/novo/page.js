'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { criarUsuario } from '@/app/actions/usuarioActions';

export default function NovoUsuarioPage() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [emailInstitucional, setEmailInstitucional] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (!emailInstitucional.endsWith('@ufape.edu.br')) {
      setErro('Utilize um e-mail institucional válido (@ufape.edu.br).');
      return;
    }

    setLoading(true);

    try {
      // Chama a Server Action centralizada com Axios
      const res = await criarUsuario({
        nome,
        emailInstitucional,
        senha,
      });

      if (res.sucesso) {
        router.push('/usuarios');
        router.refresh();
      } else {
        setErro(res.erro);
      }
    } catch (error) {
      console.error('Erro:', error);
      setErro('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-10 flex flex-col items-center justify-start gap-6 bg-canvas text-ink font-sans">
      <div className="w-full max-w-2xl space-y-6">
        
        {/* CARD: Formulário no Padrão do Sistema */}
        <div className="p-6 md:p-8 rounded-2xl border border-line bg-surface shadow-sm space-y-6">
          
          <div className="flex items-center gap-4 border-b border-line pb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-brand-50 text-brand-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-ink">
                Cadastrar Novo Usuário
              </h1>
              <p className="text-xs text-ink-soft">
                Preencha as informações para registrar um novo membro no sistema
              </p>
            </div>
          </div>

          {erro && (
            <div className="p-4 rounded-xl text-xs font-semibold bg-danger-soft text-danger border border-danger/20">
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Nome Completo */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold block text-ink">
                Nome Completo <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                placeholder="Digite o nome completo"
                className="w-full px-4 py-3 rounded-full border border-line bg-canvas text-ink text-sm outline-none transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500/20"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            {/* E-mail Institucional */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold block text-ink">
                E-mail Institucional <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                placeholder="exemplo@ufape.edu.br"
                className="w-full px-4 py-3 rounded-full border border-line bg-canvas text-ink text-sm outline-none transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500/20"
                value={emailInstitucional}
                onChange={(e) => setEmailInstitucional(e.target.value)}
                required
              />
            </div>

            {/* Senha */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold block text-ink">
                Senha <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-full border border-line bg-canvas text-ink text-sm outline-none transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500/20"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            {/* Ações */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
              <Link 
                href="/usuarios" 
                className="px-5 py-2.5 rounded-full border border-line text-xs font-bold text-ink-soft hover:bg-canvas transition-colors"
              >
                Cancelar
              </Link>
              <button 
                type="submit" 
                disabled={loading}
                className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 shadow-sm transition-all disabled:opacity-60"
              >
                {loading ? "Salvando..." : "Salvar Usuário"}
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
}