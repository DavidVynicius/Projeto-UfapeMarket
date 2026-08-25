package br.edu.ufape.poo.UfapeMarket.comunicacao.conversor;

import org.springframework.stereotype.Component;

import br.edu.ufape.poo.UfapeMarket.comunicacao.dto.request.CategoriaDTORequest;
import br.edu.ufape.poo.UfapeMarket.comunicacao.dto.response.CategoriaDTOResponse;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Categoria;

@Component
public class CategoriaConversor {

    public Categoria requestToEntity(CategoriaDTORequest dto) {
        Categoria categoria = new Categoria();
        categoria.setNome(dto.nome());
        return categoria;
    }

    public CategoriaDTOResponse entityToResponse(Categoria categoria) {
        return new CategoriaDTOResponse(
            categoria.getId(),
            categoria.getNome()
        );
    }
}