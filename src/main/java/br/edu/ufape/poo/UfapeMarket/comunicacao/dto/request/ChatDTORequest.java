package br.edu.ufape.poo.UfapeMarket.comunicacao.dto.request;

public record ChatDTORequest(
        Long produtoId,
        Long vendedorId,
        Long compradorId
) {
}