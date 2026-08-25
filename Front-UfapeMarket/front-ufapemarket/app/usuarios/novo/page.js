"use client"; // Necessário para interatividade no browser[cite: 3]

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; //[cite: 4]

export default function NovoUsuario() {
  const router = useRouter();

  // Estados para guardar o que o usuário digita
  const [nome, setNome] = useState("");
  const [emailInstitucional, setEmailInstitucional] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  // Função que roda ao enviar o formulário
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que a página recarregue
    setLoading(true);

    try {
      // Fazendo o POST para a sua API na porta 8081
      const response = await fetch("http://localhost:8081/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: nome,
          emailInstitucional: emailInstitucional,
          senha: senha,
        }),
      });

      if (response.ok) {
        alert("Usuário cadastrado com sucesso!");
        router.push("/usuarios"); // Redireciona de volta para a tabela
        router.refresh(); // Força a atualização dos dados da tabela
      } else {
        alert("Erro ao cadastrar usuário. Verifique as validações do backend.");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Cadastrar Novo Usuário</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-base-100 shadow-xl rounded-lg p-6 space-y-4"
      >
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Nome Completo</span>
          </label>
          <input
            type="text"
            placeholder="Digite o nome"
            className="input input-bordered w-full"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">E-mail Institucional</span>
          </label>
          <input
            type="email"
            placeholder="exemplo@ufape.edu.br"
            className="input input-bordered w-full"
            value={emailInstitucional}
            onChange={(e) => setEmailInstitucional(e.target.value)}
            required
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Senha</span>
          </label>
          <input
            type="password"
            placeholder="Sua senha secreta"
            className="input input-bordered w-full"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Link href="/usuarios" className="btn btn-ghost">
            Cancelar
          </Link>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Salvando..." : "Salvar Usuário"}
          </button>
        </div>
      </form>
    </main>
  );
}
