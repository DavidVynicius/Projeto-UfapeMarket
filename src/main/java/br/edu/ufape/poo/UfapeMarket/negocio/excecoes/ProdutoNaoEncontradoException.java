package br.edu.ufape.poo.UfapeMarket.negocio.excecoes;

public class ProdutoNaoEncontradoException extends RuntimeException {

	 public ProdutoNaoEncontradoException() {
	        super("Produto não encontrado.");
	    }
}
