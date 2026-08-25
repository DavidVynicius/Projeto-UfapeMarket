package br.edu.ufape.poo.UfapeMarket.negocio.basica;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;

@Entity
public class Usuario {
	@Id
	@GeneratedValue (strategy = GenerationType.IDENTITY)
    private long id;
    private String nome;
    private String emailInstitucional;
    private String senha;
    private LocalDate dataNascimento;
    private String curso;
    private String fotoPerfil;
    private String biografia;

    public Usuario() {
		super();
	}

	@OneToMany(mappedBy = "vendedor")
    private List<Produto> produtos = new ArrayList<>();
    
    @OneToMany(mappedBy = "destinatario")
    private List<Notificacao> notificacoes = new ArrayList<>();
    
    @ManyToMany
    @JoinTable(name = "usuario_produto_favorito",
	    		joinColumns = @JoinColumn(name = "usuario_id"),
	            inverseJoinColumns = @JoinColumn(name = "produto_id"))
    private List<Produto> favoritos = new ArrayList<>();
    
    @OneToMany(mappedBy = "remetente")
    private List<Mensagem> mensagem = new ArrayList<>();

    public Usuario(String nome, String emailInstitucional, String senha,
                   LocalDate dataNascimento, String curso,
                   String fotoPerfil, String biografia) {

        this.nome = nome;
        this.emailInstitucional = emailInstitucional;
        this.senha = senha;
        this.dataNascimento = dataNascimento;
        this.curso = curso;
        this.fotoPerfil = fotoPerfil;
        this.biografia = biografia;

    }



    public boolean fazerLogin(String email, String senha) {
        return this.emailInstitucional.equals(email)
                && this.senha.equals(senha);
    }

    public void favoritarProduto(Produto produto) {
    	if(!this.favoritos.contains(produto)) {
    		this.favoritos.add(produto);
    	};
    }


    public long getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmailInstitucional() {
        return emailInstitucional;
    }

    public void setEmailInstitucional(String emailInstitucional) {
        this.emailInstitucional = emailInstitucional;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public LocalDate getDataNascimento() {
        return dataNascimento;
    }

    public void setDataNascimento(LocalDate dataNascimento) {
        this.dataNascimento = dataNascimento;
    }

    public String getCurso() {
        return curso;
    }

    public void setCurso(String curso) {
        this.curso = curso;
    }

    public String getFotoPerfil() {
        return fotoPerfil;
    }

    public void setFotoPerfil(String fotoPerfil) {
        this.fotoPerfil = fotoPerfil;
    }

    public String getBiografia() {
        return biografia;
    }

    public void setBiografia(String biografia) {
        this.biografia = biografia;
    }

    public List<Produto> getProdutos() {
        return produtos;
    }

    public void setProdutos(List<Produto> produtos) {
        this.produtos = produtos;
    }

    public List<Notificacao> getNotificacoes() {
        return notificacoes;
    }

    public void setNotificacoes(List<Notificacao> notificacoes) {
        this.notificacoes = notificacoes;
    }
    public List<Mensagem> getMensagem() {
        return mensagem;
    }
    
    public void setMensagem(List<Mensagem> mensagem) {
        this.mensagem = mensagem;
    }

    @Override
    public String toString() {
        return "Usuario{" +
                "id=" + id +
                ", nome='" + nome + '\'' +
                ", emailInstitucional='" + emailInstitucional + '\'' +
                ", curso='" + curso + '\'' +
                '}';
    }
}