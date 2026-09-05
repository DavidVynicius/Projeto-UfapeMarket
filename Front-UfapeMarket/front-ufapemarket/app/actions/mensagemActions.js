"use server";

import api from "@/services/api";

export async function enviarMensagem(mensagemData) {
  try {
    const response = await api.post("/mensagens", mensagemData);
    return { sucesso: true, dados: response.data };
  } catch (erro) {
    return {
      sucesso: false,
      erro: erro.response?.data || "Erro ao enviar mensagem",
    };
  }
}

export async function removerMensagem(id) {
  try {
    await api.delete(`/mensagens/${id}`);
    return { sucesso: true };
  } catch (erro) {
    return {
      sucesso: false,
      erro: erro.response?.data || "Erro ao remover mensagem",
    };
  }
}