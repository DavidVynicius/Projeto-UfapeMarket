package br.edu.ufape.poo.UfapeMarket.comunicacao.conversor;

import org.springframework.stereotype.Component;
import br.edu.ufape.poo.UfapeMarket.comunicacao.dto.request.ProdutoDTORequest;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Produto;
import br.edu.ufape.poo.UfapeMarket.comunicacao.dto.response.ProdutoDTOResponse;

@Component

public class ProdutoConversor {

	public Produto paraEntidade(ProdutoDTORequest dto) {

        Produto produto = new Produto();

        produto.setNome(dto.nome());
        produto.setDescricaoProduto(dto.descricaoProduto());
        produto.setFotoProduto(dto.fotoProduto());
        produto.setPreco(dto.preco());
        produto.setDisponivel(dto.disponivel());
        produto.setQuantidadeDisponivel(dto.quantidadeDisponivel());
        produto.setTurnoDisponibilidade(dto.turnoDisponibilidade());
        produto.setFormasPagamento(dto.formasPagamento());

        return produto;
    }
	
	public ProdutoDTOResponse paraResponse(Produto produto) {

	    Long idCategoria = produto.getCategoria() != null
	            ? produto.getCategoria().getId()
	            : null;

	    Long idVendedor = produto.getVendedor() != null
	            ? produto.getVendedor().getId()
	            : null;

	    return new ProdutoDTOResponse(
	            produto.getId(),
	            produto.getNome(),
	            produto.getDescricaoProduto(),
	            produto.getFotoProduto(),
	            produto.getPreco(),
	            produto.isDisponivel(),
	            produto.getQuantidadeDisponivel(),
	            produto.getTurnoDisponibilidade(),
	            produto.getFormasPagamento(),
	            idCategoria,
	            idVendedor);
	}
}
