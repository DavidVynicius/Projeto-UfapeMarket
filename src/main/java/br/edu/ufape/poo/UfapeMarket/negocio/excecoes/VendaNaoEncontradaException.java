package br.edu.ufape.poo.UfapeMarket.negocio.excecoes;

public class VendaNaoEncontradaException extends RuntimeException {

    public VendaNaoEncontradaException() {
        super("Venda não encontrada.");
    }
}