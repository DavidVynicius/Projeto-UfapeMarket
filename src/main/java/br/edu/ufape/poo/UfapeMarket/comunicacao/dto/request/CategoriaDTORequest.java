package br.edu.ufape.poo.UfapeMarket.comunicacao.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CategoriaDTORequest(
		
    @NotBlank(message = "O nome da categoria é obrigatório")
    String nome
    
) {
	
}