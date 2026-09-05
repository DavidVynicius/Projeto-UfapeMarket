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
    const payload = {
      nome: dadosUsuario.nome?.trim(),
      emailInstitucional: dadosUsuario.emailInstitucional?.trim(),
      senha: dadosUsuario.senha,
      curso: dadosUsuario.curso?.trim() || null,
      dataNascimento: dadosUsuario.dataNascimento || null,
      fotoPerfil: dadosUsuario.fotoPerfil || null,
      biografia: dadosUsuario.biografia || null,
    };

    const response = await api.post("/usuarios", payload);
    return { sucesso: true, dados: response.data };
  } catch (erro) {
    console.error(
      "Erro completo no cadastro:",
      erro.response?.data || erro.message,
    );

    const erroData = erro.response?.data;
    let mensagemFinal = "Erro ao cadastrar usuário no servidor.";

    if (typeof erroData === "string") {
      mensagemFinal = erroData;
    } else if (erroData?.message) {
      mensagemFinal = erroData.message;
    } else if (erroData?.errors && typeof erroData.errors === "object") {
      const chaves = Object.keys(erroData.errors);
      if (chaves.length > 0) {
        mensagemFinal = erroData.errors[chaves[0]];
      }
    }

    return {
      sucesso: false,
      erro: mensagemFinal,
    };
  }
}

// Login com autenticação JWT segura
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
    // Chama a rota dedicada de login do Spring Boot
    const response = await api.post("/usuarios/login", { email, senha });

    // O backend retorna um JSON com { token, usuario }
    const { token, usuario } = response.data;

    return {
      sucesso: true,
      dados: usuario,
      token: token,
    };
  } catch (erro) {
    console.error("Erro na autenticação:", erro.response?.data || erro.message);

    let mensagem = "E-mail ou senha inválidos.";
    if (typeof erro.response?.data === "string") {
      mensagem = erro.response.data;
    }

    return {
      sucesso: false,
      erro: mensagem,
    };
  }
}
