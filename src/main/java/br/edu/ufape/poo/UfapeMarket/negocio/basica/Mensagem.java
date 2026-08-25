package br.edu.ufape.poo.UfapeMarket.negocio.basica;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
public class Mensagem {
	@Id
	@GeneratedValue (strategy = GenerationType.IDENTITY)
	private long id;
	private String texto;
	private LocalDateTime dataHora;
	
	@ManyToOne
	@JoinColumn(name = "remetente_id")
	private Usuario remetente;
	
	@ManyToOne
	@JoinColumn(name = "chat_id")
	private Chat chat;
	
	public Mensagem() {
		this.dataHora = LocalDateTime.now();
	}
	
	public Mensagem(long id, String texto, Usuario remetente) {
		this.id = id;
		this.texto = texto;
		this.dataHora = LocalDateTime.now();
		this.remetente = remetente;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getTexto() {
		return texto;
	}

	public void setTexto(String texto) {
		this.texto = texto;
	}

	public LocalDateTime getDataHora() {
		return dataHora;
	}

	public void setDataHora(LocalDateTime dataHora) {
		this.dataHora = dataHora;
	}

	public Usuario getRemetente() {
		return remetente;
	}

	public void setRemetente(Usuario remetente) {
		this.remetente = remetente;
	}
	
	public Chat getChat() {
		return chat;
	}
	
	public void setChat(Chat chat) {
		this.chat = chat;
	}
}