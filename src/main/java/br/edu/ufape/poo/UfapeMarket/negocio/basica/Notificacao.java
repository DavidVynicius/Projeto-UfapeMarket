package br.edu.ufape.poo.UfapeMarket.negocio.basica;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;


@Entity
public class Notificacao {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	private String titulo;
	private String mensagem;
	private LocalDateTime dataHora;
	private boolean lida;
	@ManyToOne
	private Usuario destinatario;
	
	public Notificacao() {}
	
	public Notificacao(long id, String titulo, String mensagem, LocalDateTime dataHora, 
					boolean lida, Usuario destinatario) {
		this.id = id;
		this.titulo = titulo;
		this.mensagem = mensagem;
		this.dataHora = dataHora;
		this.lida = lida;
		this.destinatario = destinatario;
	}
		

	
	public long getId() {
		return id;
	}
	
	public void setId(long id) {
		this.id = id;
	}
	
	public String getTitulo() {
		return titulo;
	}
	
	public void setTitulo(String titulo) {
		this.titulo = titulo;
	} 
	
	public String getMensagem() {
		return mensagem;
	}
	
	public void setMensagem(String mensagem) {
		this.mensagem = mensagem;
	}
	
	public LocalDateTime getDataHora() {
		return dataHora;
	}
	
	public void setDataHora(LocalDateTime dataHora) {
		this.dataHora = dataHora;
	}
	
	public boolean getLida() {
		return lida;
	}
	
	public void setLida(boolean lida) {
		this.lida = lida;
	}
	
	public Usuario getDestinatario() {
		return destinatario;
	}
	
	public void setDestinatario(Usuario destinatario) {
		this.destinatario = destinatario;
	}
	
	
	
	public void marcarComoLida() {
		this.lida  = true;
	}
	
}
