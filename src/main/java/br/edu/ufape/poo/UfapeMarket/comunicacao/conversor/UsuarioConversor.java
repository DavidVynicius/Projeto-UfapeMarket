package br.edu.ufape.poo.UfapeMarket.comunicacao.conversor;

import org.springframework.stereotype.Component;

import br.edu.ufape.poo.UfapeMarket.comunicacao.dto.request.UsuarioDTORequest;
import br.edu.ufape.poo.UfapeMarket.comunicacao.dto.response.UsuarioDTOResponse;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Usuario;

@Component
public class UsuarioConversor {

    public Usuario paraEntidade(UsuarioDTORequest dto) {

        return new Usuario(
                dto.nome(),
                dto.emailInstitucional(),
                dto.senha(),
                dto.dataNascimento(),
                dto.curso(),
                dto.fotoPerfil(),
                dto.biografia()
        );
    }

    public UsuarioDTOResponse paraResponse(Usuario usuario) {

        return new UsuarioDTOResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmailInstitucional(),
                usuario.getDataNascimento(),
                usuario.getCurso(),
                usuario.getFotoPerfil(),
                usuario.getBiografia()
        );
    }
}