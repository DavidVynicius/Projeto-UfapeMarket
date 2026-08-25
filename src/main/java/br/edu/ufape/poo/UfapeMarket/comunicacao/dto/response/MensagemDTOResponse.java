package br.edu.ufape.poo.UfapeMarket.comunicacao.dto.response;

import java.time.LocalDateTime;

public record MensagemDTOResponse(
    Long id,
    String texto,
    LocalDateTime dataHora,
    Long remetenteId,
    Long chatId
    
) {
}