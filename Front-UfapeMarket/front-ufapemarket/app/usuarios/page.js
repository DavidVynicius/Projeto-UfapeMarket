import Link from "next/link";
import BotaoExcluir from "./BotaoExcluir";

async function getUsuarios() {
  try {
    // Fazendo a requisição para o seu Spring Boot[cite: 1]
    // OBS: Ajuste a URL se a sua rota de listagem for diferente de /usuarios
    const response = await fetch("http://localhost:8081/usuarios", {
      cache: "no-store", // Isso garante que os dados sejam sempre atualizados
    });

    if (!response.ok) {
      throw new Error("Falha ao buscar usuários");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro na requisição:", error);
    return []; // Retorna um array vazio em caso de erro
  }
}

// O componente da página é assíncrono para permitir o uso do await[cite: 1]
export default async function UsuariosPage() {
  const usuarios = await getUsuarios();

  return (
    <main className="p-10 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Lista de Usuários</h1>
        <Link href="/usuarios/novo" className="btn btn-primary">
          Novo Usuário
        </Link>
      </div>

      <div className="overflow-x-auto bg-base-100 shadow-xl rounded-lg">
        <table className="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {/* Iterando sobre a lista de usuários vinda do Java[cite: 1] */}
            {usuarios.length > 0 ? (
              usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.nome}</td>
                  <td>{usuario.email}</td>
                  <td>
                    <button className="btn btn-sm btn-info mr-2">
                      Detalhes
                    </button>
                    <BotaoExcluir id={usuario.id} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  Nenhum usuário encontrado ou backend desligado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
