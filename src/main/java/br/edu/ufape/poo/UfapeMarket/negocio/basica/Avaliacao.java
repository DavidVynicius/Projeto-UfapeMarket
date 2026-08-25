package br.edu.ufape.poo.UfapeMarket.negocio.basica;
import java.util.List;

import jakarta.persistence.*;
@Entity


public class Avaliacao {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	private int nota;
	private String comentario;
	@ManyToOne
	@JoinColumn(name = "avaliado_id")
	private Usuario avaliado;
	@ManyToOne
	@JoinColumn(name = "autor_id")
	private Usuario autor;
	
<<<<<<< HEAD
	public Avaliacao() {}
=======
	public Avaliacao() {
		
	}
>>>>>>> 6d75ba5da2f13e5334ac97a431c4a403fd2765c1
	
	public Avaliacao(int nota, String comentario, Usuario avaliado, Usuario autor) {
		super();
		this.nota = nota;
		this.comentario = comentario;
		this.avaliado = avaliado;
		this.autor = autor;
	}
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public int getNota() {
		return nota;
	}
	public void setNota(int nota) {
		this.nota = nota;
	}
	public String getComentario() {
		return comentario;
	}
	public void setComentario(String comentario) {
		this.comentario = comentario;
	}
	public Usuario getAvaliado() {
		return avaliado;
	}
	public void setAvaliado(Usuario avaliado) {
		this.avaliado = avaliado;
	}
	public Usuario getAutor() {
		return autor;
	}
	public void setAutor(Usuario autor) {
		this.autor = autor;
	}
	
}

