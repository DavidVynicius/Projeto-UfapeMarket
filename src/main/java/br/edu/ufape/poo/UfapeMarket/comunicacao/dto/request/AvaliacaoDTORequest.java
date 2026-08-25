package br.edu.ufape.poo.UfapeMarket.comunicacao.dto.request;

public record AvaliacaoDTORequest(
        int nota,
        String comentario,
        Long avaliadoId,
        Long autorId
) {
}