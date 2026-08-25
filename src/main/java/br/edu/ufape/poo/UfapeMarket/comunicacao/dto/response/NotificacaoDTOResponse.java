package br.edu.ufape.poo.UfapeMarket.comunicacao.dto.response;

import java.time.LocalDateTime;

public record NotificacaoDTOResponse(
        Long id,
        String titulo,
        String mensagem,
        LocalDateTime dataHora,
        boolean lida,
        Long destinatarioId
) {
}