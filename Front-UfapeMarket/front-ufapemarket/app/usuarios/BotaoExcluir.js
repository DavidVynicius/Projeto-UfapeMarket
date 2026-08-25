"use client"; // Exclusivo para o cliente poder usar o onClick[cite: 3]

import { useRouter } from "next/navigation";

export default function BotaoExcluir({ id }) {
  const router = useRouter();

  const handleExcluir = async () => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        const response = await fetch(`http://localhost:8081/usuarios/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("Usuário excluído!");
          router.refresh(); // Recarrega a tabela[cite: 1]
        } else {
          alert("Erro ao excluir. Pode haver vínculos no banco de dados.");
        }
      } catch (error) {
        console.error("Erro:", error);
        alert("Erro de conexão.");
      }
    }
  };

  return (
    <button onClick={handleExcluir} className="btn btn-sm btn-error">
      Excluir
    </button>
  );
}
