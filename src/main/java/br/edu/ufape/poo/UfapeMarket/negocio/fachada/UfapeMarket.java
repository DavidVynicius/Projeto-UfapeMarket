package br.edu.ufape.poo.UfapeMarket.negocio.fachada;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.edu.ufape.poo.UfapeMarket.negocio.basica.Avaliacao;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Categoria;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Chat;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Mensagem;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Notificacao;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Produto;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Usuario;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Venda;

import br.edu.ufape.poo.UfapeMarket.negocio.cadastro.InterfaceCadastroAvaliacao;
import br.edu.ufape.poo.UfapeMarket.negocio.cadastro.InterfaceCadastroCategoria;
import br.edu.ufape.poo.UfapeMarket.negocio.cadastro.InterfaceCadastroChat;
<<<<<<< HEAD
=======
import br.edu.ufape.poo.UfapeMarket.negocio.cadastro.InterfaceCadastroNotificacao;
>>>>>>> 6d75ba5da2f13e5334ac97a431c4a403fd2765c1
import br.edu.ufape.poo.UfapeMarket.negocio.cadastro.InterfaceCadastroProduto;
import br.edu.ufape.poo.UfapeMarket.negocio.cadastro.InterfaceCadastroUsuario;
import br.edu.ufape.poo.UfapeMarket.negocio.cadastro.InterfaceCadastroVenda;
import br.edu.ufape.poo.UfapeMarket.negocio.cadastro.InterfaceGerenciadorMensagem;

import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.CategoriaDuplicadaException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.MensagemVaziaException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.ProdutoCategoriaObrigatoriaException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.ProdutoDescricaoObrigatoriaException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.ProdutoEstoqueInsuficienteException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.ProdutoIndisponivelException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.ProdutoNaoEncontradoException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.ProdutoNomeObrigatorioException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.ProdutoPrecoInvalidoException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.ProdutoQuantidadeInvalidaException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.UsuarioEmailInvalidoException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.UsuarioEmailJaCadastradoException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.UsuarioNaoEncontradoException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.UsuarioNaoPodeSeAvaliarException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.UsuarioNomeObrigatorioException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.VendaDataObrigatoriaException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.VendaNaoEncontradaException;
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

    @Autowired
    private InterfaceCadastroNotificacao cadastroNotificacao;

    @Autowired
    private InterfaceCadastroProduto cadastroProduto;

    @Autowired
    private InterfaceCadastroVenda cadastroVenda;


    @Override
    public Usuario salvarUsuario(Usuario usuario)
            throws UsuarioNomeObrigatorioException,
                   UsuarioEmailInvalidoException,
                   UsuarioEmailJaCadastradoException {

        return cadastroUsuario.salvarUsuario(usuario);
    }

    @Override
    public List<Usuario> listarUsuarios() {
        return cadastroUsuario.listarUsuarios();
    }

    @Override
    public Usuario localizarUsuarioEmail(String email) {
        return cadastroUsuario.localizarUsuarioEmail(email);
    }

    @Override
    public Categoria salvarCategoria(Categoria categoria)
            throws CategoriaDuplicadaException {

        return cadastroCategoria.salvarCategoria(categoria);
    }

    @Override
    public List<Categoria> listarCategorias() {
        return cadastroCategoria.listarCategorias();
    }

    @Override
    public Categoria procurarCategoriaID(Long id) {
        return cadastroCategoria.encontrarCategoriaId(id).get();
    }

    @Override
    public void removerCategoriaId(Long id) {
        cadastroCategoria.removerCategoriaId(id);
    }

    @Override
    public Chat salvarChat(Chat chat) {
        return cadastroChat.salvarChat(chat);
    }

    @Override
    public List<Chat> listarChats() {
        return cadastroChat.listarChats();
    }

    @Override
    public Mensagem enviarMensagem(Mensagem mensagem)
            throws MensagemVaziaException {

        return gerenciadorMensagem.enviarMensagem(mensagem);
    }

    @Override
    public void removerMensagemId(Long id) {
        gerenciadorMensagem.removerMensagemId(id);
    }

    @Override
    public Avaliacao avaliarProduto(Avaliacao avaliacao)
            throws UsuarioNaoPodeSeAvaliarException {

        if (avaliacao.getAutor().getId() == avaliacao.getAvaliado().getId()) {
            throw new UsuarioNaoPodeSeAvaliarException();
        }

        return cadastroAvaliacao.salvarAvaliacao(avaliacao);
    }

    @Override
    public void favoritarProduto(Usuario usuario, Produto produto) {
        usuario.favoritarProduto(produto);
    }

    @Override
    public void escolherCategoria(Produto produto, Categoria categoria)
            throws ProdutoCategoriaObrigatoriaException {

        produto.alterarCategoria(categoria);
    }

    @Override
    public void fazerVenda(Venda venda, Produto produto, int quantidade)
            throws VendaProdutoObrigatorioException,
                   ProdutoQuantidadeInvalidaException,
                   ProdutoEstoqueInsuficienteException,
                   ProdutoIndisponivelException {

        if (!produto.isDisponivel()) {
            throw new ProdutoIndisponivelException();
        }

        venda.realizarVenda(produto, quantidade);
    }

    @Override
    public Usuario procurarUsuarioID(Long id)
            throws UsuarioNaoEncontradoException {

        return cadastroUsuario.procurarUsuarioID(id).get();
    }

    @Override
    public void deletarUsuarioId(Long id)
            throws UsuarioNaoEncontradoException {

        cadastroUsuario.deletarUsuarioId(id);
    }

    @Override
    public Notificacao salvarNotificacao(Notificacao notificacao) {
        return cadastroNotificacao.salvarNotificacao(notificacao);
    }

    @Override
    public List<Notificacao> listarNotificacoes() {
        return cadastroNotificacao.listarNotificacoes();
    }

    @Override
    public Notificacao procurarNotificacaoID(Long id) {
        return cadastroNotificacao.procurarNotificacaoID(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Notificação não encontrada."));
    }

    @Override
    public void deletarNotificacaoId(Long id) {
        cadastroNotificacao.deletarNotificacaoId(id);
    }

    @Override
    public void marcarNotificacaoComoLida(Long id) {
        cadastroNotificacao.marcarComoLida(id);
    }

    @Override
    public Produto salvarProduto(Produto produto)
            throws ProdutoNomeObrigatorioException,
                   ProdutoDescricaoObrigatoriaException,
                   ProdutoPrecoInvalidoException,
                   ProdutoQuantidadeInvalidaException,
                   ProdutoCategoriaObrigatoriaException {

        return cadastroProduto.salvarProduto(produto);
    }

    @Override
    public List<Produto> listarProdutos() {
        return cadastroProduto.listarProdutos();
    }

    @Override
    public Produto procurarProdutoID(Long id) {
        return cadastroProduto.procurarProdutoID(id)
                .orElseThrow(ProdutoNaoEncontradoException::new);
    }

    @Override
    public void deletarProdutoId(Long id) {
        cadastroProduto.deletarProdutoId(id);
    }

    @Override
    public Venda salvarVenda(Venda venda)
            throws VendaDataObrigatoriaException,
                   VendaProdutoObrigatorioException,
                   ProdutoQuantidadeInvalidaException {

        return cadastroVenda.salvarVenda(venda);
    }

    @Override
    public List<Venda> listarVendas() {
        return cadastroVenda.listarVendas();
    }

    @Override
    public Venda procurarVendaID(Long id) {
        return cadastroVenda.procurarVendaID(id)
                .orElseThrow(VendaNaoEncontradaException::new);
    }

    @Override
    public void deletarVendaId(Long id) {
        cadastroVenda.deletarVendaId(id);
    }
    
    @Override
    public List<Avaliacao> listarAvaliacoes() {
        return cadastroAvaliacao.listarAvaliacoes();
    }

    @Override
    public Avaliacao procurarAvaliacaoID(Long id) {
        return cadastroAvaliacao.procurarAvaliacaoID(id)
                .orElseThrow(() -> new IllegalArgumentException("Avaliação não encontrada."));
    }

    @Override
    public void deletarAvaliacaoId(Long id) {
        cadastroAvaliacao.deletarAvaliacaoId(id);
    }
}