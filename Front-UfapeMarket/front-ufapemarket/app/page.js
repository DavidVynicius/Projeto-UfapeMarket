'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUsuario, criarUsuario } from '@/app/actions/usuarioActions';

export default function AuthPage() {
  const router = useRouter();
  const [modo, setModo] = useState('login'); 

  // Estados alinhados com Usuario.java
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [curso, setCurso] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [senha, setSenha] = useState('');
  
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const alternarModo = (novoModo) => {
    setModo(novoModo);
    setErro('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (!email.endsWith('@ufape.edu.br')) {
      setErro('Por favor, utilize seu e-mail institucional (@ufape.edu.br).');
      return;
    }

    setCarregando(true);

    try {
      if (modo === 'login') {
        const res = await loginUsuario({ email, senha });
        
        if (res.sucesso) {
          localStorage.setItem('usuarioLogado', JSON.stringify(res.dados));
          
          window.location.href = '/explorar';
        } else {
          setErro(res.erro);
        }
      } else {
        const res = await criarUsuario({
          nome,
          emailInstitucional: email,
          curso,
          dataNascimento,
          senha,
        });

        if (res.sucesso) {
          alert('Conta criada com sucesso! Faça login para continuar.');
          setModo('login');
        } else {
          setErro(res.erro);
        }
      }
    } catch (err) {
      setErro('Erro na conexão com o servidor. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-canvas text-ink font-sans">
      
      {/* PAINEL ESQUERDO: Verde Institucional */}
      <div className="hidden lg:flex flex-col justify-between p-12 lg:p-16 text-white bg-brand-500 relative overflow-hidden">
        
        {/* Topo / Logo */}
        <div className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-xl">
            U
          </div>
          <span className="font-bold text-xl tracking-tight">
            UFAPE <span className="opacity-90">Market</span>
          </span>
        </div>

        {/* Conteúdo Central */}
        <div className="space-y-8 max-w-lg z-10">
          <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight">
            Compre, venda e conecte-se dentro da UFAPE.
          </h1>
          
          <p className="text-base text-emerald-100/90 leading-relaxed">
            Um marketplace feito por estudantes, para estudantes. Encontre o que precisa sem sair do campus.
          </p>

          <div className="space-y-5 pt-2">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-emerald-50">Anuncie e venda seus produtos em minutos</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 4.418 9 8z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-emerald-50">Converse direto com quem vende</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-emerald-50">Avalie e confie na comunidade acadêmica</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-emerald-200/70 font-medium z-10">
          Universidade Federal do Agreste de Pernambuco
        </p>
      </div>

      {/* PAINEL DIREITO: Formulário */}
      <div className="flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-6">
          
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
              {modo === 'login' ? 'Bem-vindo ao UFAPE Market' : 'Crie sua conta'}
            </h2>
            <p className="text-sm mt-1.5 text-ink-soft">
              {modo === 'login'
                ? 'Entre com sua conta para continuar.'
                : 'Preencha seus dados institucionais para se cadastrar.'}
            </p>
          </div>

          {erro && (
            <div className="p-4 rounded-xl text-xs font-semibold bg-danger-soft text-danger border border-danger/20">
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Nome Completo (Modo Cadastro) */}
            {modo === 'cadastro' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold block text-ink">
                  Nome Completo <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Seu nome completo"
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-full border border-line bg-surface text-ink text-sm outline-none transition-all focus:ring-2 focus:ring-brand-500/20 placeholder:text-ink-faint"
                  />
                  <svg className="w-4 h-4 absolute left-4 top-3.5 text-ink-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            )}

            {/* E-mail Institucional */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold block text-ink">
                E-mail institucional <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@ufape.edu.br"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-full border border-line bg-surface text-ink text-sm outline-none transition-all focus:ring-2 focus:ring-brand-500/20 placeholder:text-ink-faint"
                />
                <svg className="w-4 h-4 absolute left-4 top-3.5 text-ink-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            {/* Curso e Data de Nascimento (Modo Cadastro) */}
            {modo === 'cadastro' && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold block text-ink">
                    Curso <span className="text-danger">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={curso}
                      onChange={(e) => setCurso(e.target.value)}
                      placeholder="Ex: Ciência da Computação"
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-full border border-line bg-surface text-ink text-sm outline-none transition-all focus:ring-2 focus:ring-brand-500/20 placeholder:text-ink-faint"
                    />
                    <svg className="w-4 h-4 absolute left-4 top-3.5 text-ink-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold block text-ink">
                    Data de Nascimento <span className="text-danger">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={dataNascimento}
                      onChange={(e) => setDataNascimento(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-full border border-line bg-surface text-ink text-sm outline-none transition-all focus:ring-2 focus:ring-brand-500/20 text-ink"
                    />
                    <svg className="w-4 h-4 absolute left-4 top-3.5 text-ink-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </>
            )}

            {/* Senha */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold block text-ink">
                Senha <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-full border border-line bg-surface text-ink text-sm outline-none transition-all focus:ring-2 focus:ring-brand-500/20 placeholder:text-ink-faint"
                />
                <svg className="w-4 h-4 absolute left-4 top-3.5 text-ink-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>

            {/* Banner Institucional */}
            <div className="p-3.5 rounded-2xl flex items-center gap-3 text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-100">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
              <span>Use seu e-mail institucional <strong>@ufape.edu.br</strong></span>
            </div>

            {/* Botão de Envio */}
            <button
              type="submit"
              disabled={carregando}
              className="w-full py-3.5 rounded-full text-white font-bold text-sm bg-brand-500 hover:bg-brand-600 flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 disabled:opacity-60"
            >
              <span>
                {carregando
                  ? modo === 'login' ? 'Entrando...' : 'Cadastrando...'
                  : modo === 'login' ? 'Entrar' : 'Cadastrar'}
              </span>
              {!carregando && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              )}
            </button>
          </form>

          {/* Alternar Modo */}
          <div className="text-center text-xs font-medium text-ink-soft">
            {modo === 'login' ? (
              <>
                Não tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => alternarModo('cadastro')}
                  className="font-bold text-brand-500 hover:underline cursor-pointer"
                >
                  Criar conta
                </button>
              </>
            ) : (
              <>
                Já tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => alternarModo('login')}
                  className="font-bold text-brand-500 hover:underline cursor-pointer"
                >
                  Fazer login
                </button>
              </>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}