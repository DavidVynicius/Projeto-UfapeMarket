package br.edu.ufape.poo.UfapeMarket.comunicacao.dto.response;

public record ProdutoDTOResponse(
		long id,String nome,String descricaoProduto,
	    String fotoProduto,double preco,boolean disponivel,int quantidadeDisponivel,
	    String turnoDisponibilidade,
	    String formasPagamento,Long idCategoria,Long idVendedor) {

}
