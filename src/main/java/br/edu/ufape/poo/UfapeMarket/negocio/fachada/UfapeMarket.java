package br.edu.ufape.poo.UfapeMarket.negocio.fachada;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.edu.ufape.poo.UfapeMarket.negocio.basica.Avaliacao;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Categoria;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Chat;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Mensagem;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Produto;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Usuario;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Venda;

import br.edu.ufape.poo.UfapeMarket.negocio.cadastro.InterfaceCadastroAvaliacao;
import br.edu.ufape.poo.UfapeMarket.negocio.cadastro.InterfaceCadastroCategoria;
import br.edu.ufape.poo.UfapeMarket.negocio.cadastro.InterfaceCadastroChat;
import br.edu.ufape.poo.UfapeMarket.negocio.cadastro.InterfaceCadastroProduto;
import br.edu.ufape.poo.UfapeMarket.negocio.cadastro.InterfaceCadastroUsuario;
import br.edu.ufape.poo.UfapeMarket.negocio.cadastro.InterfaceCadastroVenda;
import br.edu.ufape.poo.UfapeMarket.negocio.cadastro.InterfaceGerenciadorMensagem;

import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.CategoriaDuplicadaException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.MensagemVaziaException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.ProdutoCategoriaObrigatoriaException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.ProdutoEstoqueInsuficienteException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.ProdutoIndisponivelException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.ProdutoQuantidadeInvalidaException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.UsuarioEmailInvalidoException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.UsuarioEmailJaCadastradoException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.UsuarioNaoPodeSeAvaliarException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.UsuarioNomeObrigatorioException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.VendaProdutoObrigatorioException;

@Service
public class UfapeMarket implements InterfaceFachada {

    @Autowired
    private InterfaceCadastroUsuario cadastroUsuario;

    @Autowired
    private InterfaceCadastroCategoria cadastroCategoria;

    @Autowired
    private InterfaceCadastroChat cadastroChat;
    
    @Autowired
    private InterfaceCadastroProduto cadastroProduto;
    
    @Autowired
    private InterfaceCadastroVenda cadastroVenda;

    @Autowired
    private InterfaceCadastroAvaliacao cadastroAvaliacao;

    @Autowired
    private InterfaceGerenciadorMensagem gerenciadorMensagem;



    public Usuario salvarUsuario(Usuario usuario)
            throws UsuarioNomeObrigatorioException,
                   UsuarioEmailInvalidoException,
                   UsuarioEmailJaCadastradoException {

        return cadastroUsuario.salvarUsuario(usuario);
    }


    public List<Usuario> listarUsuarios() {
        return cadastroUsuario.listarUsuarios();
    }

    public Usuario localizarUsuarioEmail(String email) {
        return cadastroUsuario.localizarUsuarioEmail(email);
    }

    public Categoria salvarCategoria(Categoria categoria)
            throws CategoriaDuplicadaException {

        return cadastroCategoria.salvarCategoria(categoria);
    }

    public List<Categoria> listarCategorias() {
        return cadastroCategoria.listarCategorias();
    }

    public Chat salvarChat(Chat chat) {
        return cadastroChat.salvarChat(chat);
    }

    public List<Chat> listarChats() {
        return cadastroChat.listarChats();
    }

    public Mensagem enviarMensagem(Mensagem mensagem)
            throws MensagemVaziaException {

        return gerenciadorMensagem.enviarMensagem(mensagem);
    }

    public Avaliacao avaliarProduto(Avaliacao avaliacao)
            throws UsuarioNaoPodeSeAvaliarException {

        if (avaliacao.getAutor().getId() == avaliacao.getAvaliado().getId()) {
            throw new UsuarioNaoPodeSeAvaliarException();
        }

        return cadastroAvaliacao.salvarAvaliacao(avaliacao);
    }

    public void favoritarProduto(Usuario usuario, Produto produto) {

        usuario.favoritarProduto(produto);
    }

    public void escolherCategoria(
            Produto produto,
            Categoria categoria)
            throws ProdutoCategoriaObrigatoriaException {

        produto.alterarCategoria(categoria);
    }

    public void fazerVenda(
            Venda venda,
            Produto produto,
            int quantidade)
            throws VendaProdutoObrigatorioException,
                   ProdutoQuantidadeInvalidaException,
                   ProdutoEstoqueInsuficienteException,
                   ProdutoIndisponivelException {

        if (!produto.isDisponivel()) {
            throw new ProdutoIndisponivelException();
        }

        venda.realizarVenda(produto, quantidade);
    }
}