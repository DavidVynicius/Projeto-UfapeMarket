package br.edu.ufape.poo.UfapeMarket.comunicacao.dto.request;

import java.time.LocalDateTime;

public record NotificacaoDTORequest(
        String titulo,
        String mensagem,
        LocalDateTime dataHora,
        boolean lida,
        Long destinatarioId
) {
}