package br.edu.ufape.poo.UfapeMarket.comunicacao.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UsuarioDTORequest(

        @NotBlank(message = "Nome é obrigatório")
        String nome,

        @NotBlank(message = "Email é obrigatório")
        @Email(message = "Email inválido")
        String emailInstitucional,

        @NotBlank(message = "Senha é obrigatória")
        String senha,

        LocalDate dataNascimento,

        String curso,

        String fotoPerfil,

        String biografia

) {

}