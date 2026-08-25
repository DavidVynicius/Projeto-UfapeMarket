package br.edu.ufape.poo.UfapeMarket.comunicacao.dto.response;

import java.time.LocalDate;

public record VendaDTOResponse(long id,LocalDate dataVenda,
		int quantidadeVendida,Long idProduto) 
{

}