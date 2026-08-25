package br.edu.ufape.poo.UfapeMarket.comunicacao.dto.response;

import java.time.LocalDate;

public record UsuarioDTOResponse(
        long id,
        String nome,
        String emailInstitucional,
        LocalDate dataNascimento,
        String curso,
        String fotoPerfil,
        String biografia
) {
}