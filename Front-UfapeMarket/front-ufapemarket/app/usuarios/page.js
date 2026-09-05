import Link from "next/link";
import BotaoExcluir from "./BotaoExcluir";
import { listarUsuarios } from "@/app/actions/usuarioActions";

export default async function UsuariosPage() {
  const usuarios = await listarUsuarios();

  return (
    <div className="min-h-screen p-6 md:p-10 flex flex-col items-center justify-start gap-6 bg-canvas text-ink font-sans">
      <div className="w-full max-w-2xl space-y-6">
        
        {/* CARD 1: Cabeçalho com Ícone e Contador */}
        <div className="p-6 rounded-2xl border border-line bg-surface shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-brand-50 text-brand-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-ink">
                Gerenciar Usuários
              </h1>
              <p className="text-xs font-medium text-ink-soft">
                Visualização e controle dos membros cadastrados no UfapeMarket
              </p>
            </div>
          </div>

          <span className="text-xs font-bold px-3 py-1.5 rounded-full shrink-0 bg-brand-50 text-brand-500">
            {usuarios.length} {usuarios.length === 1 ? 'usuário' : 'usuários'}
          </span>
        </div>

        {/* CARD 2: Botão de Ação para Novo Cadastro */}
        <div className="p-6 rounded-2xl border border-line bg-surface shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-ink">
              Novo Cadastro
            </h2>
            <p className="text-xs text-ink-soft">
              Adicione um novo estudante ou vendedor à plataforma
            </p>
          </div>

          <Link
            href="/usuarios/novo"
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-brand-500 hover:bg-brand-600 shadow-sm transition-transform active:scale-95 flex items-center gap-1.5"
          >
            <span>+</span> Novo Usuário
          </Link>
        </div>

        {/* CARD 3: Tabela / Lista de Usuários */}
        <div className="p-6 rounded-2xl border border-line bg-surface shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-ink">
            Usuários Cadastrados
          </h2>

          {usuarios.length === 0 ? (
            <div className="p-8 rounded-xl border border-dashed border-line text-center">
              <p className="text-xs font-medium text-ink-faint">
                Nenhum usuário encontrado ou backend desligado.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-line text-[11px] font-bold uppercase tracking-wider text-ink-faint">
                    <th className="pb-3 px-2">ID</th>
                    <th className="pb-3 px-2">Nome</th>
                    <th className="pb-3 px-2">E-mail</th>
                    <th className="pb-3 px-2 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line text-xs font-medium">
                  {usuarios.map((usuario) => (
                    <tr key={usuario.id} className="hover:bg-brand-50/40 transition-colors">
                      <td className="py-3.5 px-2 font-mono text-ink-faint">
                        #{usuario.id}
                      </td>
                      <td className="py-3.5 px-2 font-bold text-ink">
                        {usuario.nome}
                      </td>
                      <td className="py-3.5 px-2 text-ink-soft">
                        {usuario.email}
                      </td>
                      <td className="py-3.5 px-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="px-3 py-1.5 rounded-lg border border-line text-[11px] font-semibold text-ink-soft hover:bg-canvas transition-colors">
                            Detalhes
                          </button>
                          <BotaoExcluir id={usuario.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}