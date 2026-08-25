package br.edu.ufape.poo.UfapeMarket.comunicacao.dto.response;

public record AvaliacaoDTOResponse(
        long id,
        int nota,
        String comentario,
        Long avaliadoId,
        Long autorId
) {
}