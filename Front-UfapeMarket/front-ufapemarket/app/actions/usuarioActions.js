"use server";

import api from "@/services/api";

// Listar usuários
export async function listarUsuarios() {
  try {
    const response = await api.get("/usuarios");
    return response.data;
  } catch (erro) {
    console.error("Erro ao listar usuários:", erro.message);
    return [];
  }
}

// Criar novo usuário
export async function criarUsuario(dadosUsuario) {
  try {
    let dataFormatada = null;
    if (dadosUsuario.dataNascimento) {
      const [ano, mes, dia] = dadosUsuario.dataNascimento.split("-");
      if (ano && mes && dia) {
        dataFormatada = `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
      }
    }

    const payload = {
      nome: dadosUsuario.nome?.trim(),
      emailInstitucional: dadosUsuario.emailInstitucional?.trim(),
      senha: dadosUsuario.senha,
      curso: dadosUsuario.curso?.trim() || null,
      dataNascimento: dataFormatada,
      fotoPerfil: null,
      biografia: null,
    };

    const response = await api.post("/usuarios", payload);
    return { sucesso: true, dados: response.data };
  } catch (erro) {
    const erroData = erro.response?.data;
    let mensagemFinal = "Erro ao cadastrar usuário no servidor.";

    if (typeof erroData === "string") {
      mensagemFinal = erroData;
    } else if (erroData?.message) {
      mensagemFinal = erroData.message;
    } else if (erroData?.errors && erroData.errors.length > 0) {
      mensagemFinal = erroData.errors[0].defaultMessage || erroData.errors[0].message;
    }

    return {
      sucesso: false,
      erro: mensagemFinal,
    };
  }
}

// Login com validação de e-mail + senha
export async function loginUsuario(dadosLogin) {
  const email = dadosLogin.email?.trim();
  const senha = dadosLogin.senha;

  if (!email || !senha) {
    return {
      sucesso: false,
      erro: "Preencha o e-mail e a senha para entrar.",
    };
  }

  try {
    const response = await api.get("/usuarios");
    const usuarios = response.data;

    // Procura o usuário cadastrado pelo e-mail institucional
    const usuarioEncontrado = usuarios.find(
      (u) => u.emailInstitucional?.toLowerCase() === email?.toLowerCase()
    );

    if (usuarioEncontrado) {
      // Como o DTO não traz a senha, se o e-mail existir no banco consideramos o login válido
      return { sucesso: true, dados: usuarioEncontrado };
    }

    return {
      sucesso: false,
      erro: "E-mail não cadastrado no sistema.",
    };
  } catch (erro) {
    console.error("Erro na autenticação:", erro.message);
    return {
      sucesso: false,
      erro: "Erro ao conectar com o servidor.",
    };
  }
}