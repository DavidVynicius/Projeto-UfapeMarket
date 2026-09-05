package br.edu.ufape.poo.UfapeMarket.comunicacao.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginDTORequest(
    @NotBlank(message = "E-mail é obrigatório")
    @Email(message = "E-mail inválido")
    String email,

    @NotBlank(message = "Senha é obrigatória")
    String senha
) {}