package br.edu.ufape.poo.UfapeMarket.comunicacao.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record MensagemDTORequest(
    @NotBlank(message = "O texto da mensagem não pode ser vazio")
    String texto,

    @NotNull(message = "O ID do remetente é obrigatório")
    Long remetenteId,

    @NotNull(message = "O ID do chat é obrigatório")
    Long chatId
) {
}