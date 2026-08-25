package br.edu.ufape.poo.UfapeMarket.negocio.basica;

import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;

import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.ProdutoEstoqueInsuficienteException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.ProdutoQuantidadeInvalidaException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.VendaDataObrigatoriaException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.VendaProdutoObrigatorioException;
import jakarta.persistence.*;

@Entity 

public class Venda {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	private LocalDate dataVenda;
	private int quantidadeVendida;
	
	@ManyToOne
	@JoinColumn(name = "produto_id")
	private Produto produto;
		
	public Venda() {
		
	}
	public Venda(long id, LocalDate dataVenda, int quantidadeVendida,Produto produto) {
		super();
		this.id = id;
		this.dataVenda = dataVenda;
		this.quantidadeVendida = quantidadeVendida;
		this.produto =  produto;
	}

	public void alterarDataVenda(LocalDate dataVenda)
	        throws VendaDataObrigatoriaException {

	    if (dataVenda == null) {
	        throw new VendaDataObrigatoriaException();
	    }

	    this.dataVenda = dataVenda;
	}
	
	public void alterarQuantidadeVendida(int quantidade)
	        throws ProdutoQuantidadeInvalidaException {

	    if (quantidade <= 0) {
	        throw new ProdutoQuantidadeInvalidaException();
	    }

	    this.quantidadeVendida = quantidade;
	}
	
	public void adicionarProduto(Produto produto)
	        throws VendaProdutoObrigatorioException {

	    if (produto == null) {
	        throw new VendaProdutoObrigatorioException();
	    }

	    this.produto = produto;
	}
	
	public void realizarVenda(Produto produto, int quantidade)
	        throws VendaProdutoObrigatorioException,
	               ProdutoQuantidadeInvalidaException,
	               ProdutoEstoqueInsuficienteException {

	    if (produto == null) {
	        throw new VendaProdutoObrigatorioException();
	    }

	    produto.baixarEstoque(quantidade);

	    this.quantidadeVendida = quantidade;
	}
	
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public LocalDate getDataVenda() {
		return dataVenda;
	}

	public void setDataVenda(LocalDate dataVenda) {
		this.dataVenda = dataVenda;
	}

	public int getQuantidadeVendida() {
		return quantidadeVendida;
	}

	public void setQuantidadeVendida(int quantidadeVendida) {
		this.quantidadeVendida = quantidadeVendida;
	}

	public Produto getProduto() {
		return produto;
	}

	public void setProduto(Produto produto) {
		this.produto = produto;
	}

	

}
