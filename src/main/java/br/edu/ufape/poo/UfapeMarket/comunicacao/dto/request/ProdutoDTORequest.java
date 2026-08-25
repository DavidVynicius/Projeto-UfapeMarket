package br.edu.ufape.poo.UfapeMarket.comunicacao.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

public record ProdutoDTORequest(

        @NotBlank String nome,

        @NotBlank String descricaoProduto,

        String fotoProduto,

        @Positive double preco,

        boolean disponivel,

        @PositiveOrZero int quantidadeDisponivel,

        String turnoDisponibilidade,

        String formasPagamento,

        @NotNull Long idCategoria,

        @NotNull Long idVendedor

) {

}