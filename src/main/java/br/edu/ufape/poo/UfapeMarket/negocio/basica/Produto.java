package br.edu.ufape.poo.UfapeMarket.negocio.basica;

import java.util.ArrayList;
import java.util.List;

import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.ProdutoPrecoInvalidoException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.ProdutoQuantidadeInvalidaException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.ProdutoCategoriaObrigatoriaException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.ProdutoDescricaoObrigatoriaException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.ProdutoEstoqueInsuficienteException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.ProdutoNomeObrigatorioException;
import jakarta.persistence.*;

@Entity
public class Produto {
	@Id
	@GeneratedValue (strategy = GenerationType.IDENTITY)
	private long id;
    private String nome;
    private String descricaoProduto;
    private String fotoProduto;
    private double preco;
    private boolean disponivel;
    private int quantidadeDisponivel;
    private String turnoDisponibilidade;
    private String formasPagamento;

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;
	
    
	@ManyToOne
	@JoinColumn(name = "vendedor_id")
	private Usuario vendedor;
		
	@OneToMany(mappedBy = "produto")
    private List<Venda> vendas =  new ArrayList<>();

	public Produto() {
		
	}
	
	public Produto(long id, String nome, String descricaoProduto, String fotoProduto, double preco, boolean disponivel,
			int quantidadeDisponivel, String turnoDisponibilidade, String formasPagamento, Categoria categoria,
			Usuario vendedor, List<Venda> vendas) {
		super();
		this.id = id;
		this.nome = nome;
		this.descricaoProduto = descricaoProduto;
		this.fotoProduto = fotoProduto;
		this.preco = preco;
		this.disponivel = disponivel;
		this.quantidadeDisponivel = quantidadeDisponivel;
		this.turnoDisponibilidade = turnoDisponibilidade;
		this.formasPagamento = formasPagamento;
		this.categoria = categoria;
		this.vendedor = vendedor;
		this.vendas = vendas;
		}
	
	public void alterarPreco(double novoPreco) throws ProdutoPrecoInvalidoException {
		if(novoPreco < 0.01) {
			throw new ProdutoPrecoInvalidoException();
		}
		else {
			this.preco = novoPreco;
		}
	}
	
	public void baixarEstoque(int quantidade)
	        throws ProdutoQuantidadeInvalidaException, ProdutoEstoqueInsuficienteException {

	    if (quantidade <= 0) {
	        throw new ProdutoQuantidadeInvalidaException();
	    }

	    if (quantidade > this.quantidadeDisponivel) {
	        throw new ProdutoEstoqueInsuficienteException();
	    }

	    this.quantidadeDisponivel =
	            this.quantidadeDisponivel - quantidade;

	    if (this.quantidadeDisponivel == 0) {
	        this.disponivel = false;
	    }
	}
	
	public void reporEstoque(int quantidade)
	        throws ProdutoQuantidadeInvalidaException {

	    if (quantidade <= 0) {
	        throw new ProdutoQuantidadeInvalidaException();
	    }

	    this.quantidadeDisponivel =
	            this.quantidadeDisponivel + quantidade;

	    this.disponivel = true;
	}
	
	public void alterarDisponibilidade(boolean disponivel) {
		if(this.quantidadeDisponivel == 0) {
			this.disponivel = false;
		}
		else {
		this.disponivel = disponivel;
		}
	}
	
	public void alterarDescricao(String descricao)
	        throws ProdutoDescricaoObrigatoriaException {

	    if (descricao == null || descricao.trim().isEmpty()) {
	        throw new ProdutoDescricaoObrigatoriaException();
	    }

	    this.descricaoProduto = descricao;
	}
	public void alterarNome(String nome)
	        throws ProdutoNomeObrigatorioException {

	    if (nome == null || nome.trim().isEmpty()) {
	        throw new ProdutoNomeObrigatorioException();
	    }

	    this.nome = nome;
	}
	public void alterarCategoria(Categoria categoria)
	        throws ProdutoCategoriaObrigatoriaException {

	    if (categoria == null) {
	        throw new ProdutoCategoriaObrigatoriaException();
	    }

	    this.categoria = categoria;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getDescricaoProduto() {
		return descricaoProduto;
	}

	public void setDescricaoProduto(String descricaoProduto) {
		this.descricaoProduto = descricaoProduto;
	}

	public String getFotoProduto() {
		return fotoProduto;
	}

	public void setFotoProduto(String fotoProduto) {
		this.fotoProduto = fotoProduto;
	}

	public double getPreco() {
		return preco;
	}

	public void setPreco(double preco) {
		this.preco = preco;
	}

	public boolean isDisponivel() {
		return disponivel;
	}

	public void setDisponivel(boolean disponivel) {
		this.disponivel = disponivel;
	}

	public int getQuantidadeDisponivel() {
		return quantidadeDisponivel;
	}

	public void setQuantidadeDisponivel(int quantidadeDisponivel) {
		this.quantidadeDisponivel = quantidadeDisponivel;
	}

	public String getTurnoDisponibilidade() {
		return turnoDisponibilidade;
	}

	public void setTurnoDisponibilidade(String turnoDisponibilidade) {
		this.turnoDisponibilidade = turnoDisponibilidade;
	}

	public String getFormasPagamento() {
		return formasPagamento;
	}

	public void setFormasPagamento(String formasPagamento) {
		this.formasPagamento = formasPagamento;
	}

	public Categoria getCategoria() {
		return categoria;
	}

	public void setCategoria(Categoria categoria) {
		this.categoria = categoria;
	}

	public Usuario getVendedor() {
		return vendedor;
	}

	public void setVendedor(Usuario vendedor) {
		this.vendedor = vendedor;
	}

	public List<Venda> getVendas() {
		return vendas;
	}

	public void setVendas(List<Venda> vendas) {
		this.vendas = vendas;
	}

	
}
