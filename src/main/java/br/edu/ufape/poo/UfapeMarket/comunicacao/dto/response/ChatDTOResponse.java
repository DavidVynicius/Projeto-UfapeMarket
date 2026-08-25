package br.edu.ufape.poo.UfapeMarket.comunicacao.dto.response;

public record ChatDTOResponse(
        Long id,
        Long produtoId,
        Long vendedorId,
        Long compradorId
) {
}