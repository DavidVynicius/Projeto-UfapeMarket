package br.edu.ufape.poo.UfapeMarket.comunicacao.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record VendaDTORequest( @NotNull LocalDate dataVenda,
        @Positive int quantidadeVendida,@NotNull Long idProduto) 
{

}