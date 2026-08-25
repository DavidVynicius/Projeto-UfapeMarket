package br.edu.ufape.poo.UfapeMarket.negocio.basica;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.*;
@Entity



public class Chat {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	@ManyToOne
	@JoinColumn(name = "produto_id")
	private Produto produto;
	@ManyToOne
	@JoinColumn(name = "vendedor_id")
	private Usuario vendedor;
	@ManyToOne
	@JoinColumn(name = "comprador_id")
	private Usuario comprador;
	
	public Chat() {
		
	}
	
	public Chat(long id, Produto produto, Usuario vendedor, Usuario comprador) {
		super();
		this.id = id;
		this.produto = produto;
		this.vendedor = vendedor;
		this.comprador = comprador;
	}
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public Produto getProduto() {
		return produto;
	}
	public void setProduto(Produto produto) {
		this.produto = produto;
	}
	public Usuario getVendedor() {
		return vendedor;
	}
	public void setVendedor(Usuario vendedor) {
		this.vendedor = vendedor;
	}
	public Usuario getComprador() {
		return comprador;
	}
	public void setComprador(Usuario comprador) {
		this.comprador = comprador;
	}
	
	
}
