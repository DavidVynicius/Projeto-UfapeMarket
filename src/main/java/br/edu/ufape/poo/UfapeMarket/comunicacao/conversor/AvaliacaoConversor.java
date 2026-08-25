package br.edu.ufape.poo.UfapeMarket.comunicacao.conversor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import br.edu.ufape.poo.UfapeMarket.comunicacao.dto.request.AvaliacaoDTORequest;
import br.edu.ufape.poo.UfapeMarket.comunicacao.dto.response.AvaliacaoDTOResponse;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Avaliacao;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Usuario;
import br.edu.ufape.poo.UfapeMarket.negocio.fachada.UfapeMarket;

@Component
public class AvaliacaoConversor {

    @Autowired
    private UfapeMarket fachada;

    public Avaliacao paraEntidade(AvaliacaoDTORequest dto) {

        Usuario autor = fachada.procurarUsuarioID(dto.autorId());
        Usuario avaliado = fachada.procurarUsuarioID(dto.avaliadoId());

        return new Avaliacao(
                dto.nota(),
                dto.comentario(),
                avaliado,
                autor
        );
    }

    public AvaliacaoDTOResponse paraResponse(Avaliacao avaliacao) {

        return new AvaliacaoDTOResponse(
                avaliacao.getId(),
                avaliacao.getNota(),
                avaliacao.getComentario(),
                avaliacao.getAvaliado().getId(),
                avaliacao.getAutor().getId()
        );
    }
}