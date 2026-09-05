package br.edu.ufape.poo.UfapeMarket;

import br.edu.ufape.poo.UfapeMarket.dados.InterfaceColecaoCategoria;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Categoria;
import br.edu.ufape.poo.UfapeMarket.dados.InterfaceRepositorioProduto;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import br.edu.ufape.poo.UfapeMarket.negocio.basica.Avaliacao;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Produto;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Usuario;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Venda;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.ProdutoEstoqueInsuficienteException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.ProdutoIndisponivelException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.ProdutoQuantidadeInvalidaException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.UsuarioNaoPodeSeAvaliarException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.VendaProdutoObrigatorioException;
import br.edu.ufape.poo.UfapeMarket.negocio.fachada.UfapeMarket;
import jakarta.transaction.Transactional;

@SpringBootTest
class UfapeMarketTest {

    @Autowired
    private UfapeMarket fachada;
    
    @Autowired
    private InterfaceRepositorioProduto repositorioProduto;

    @Autowired
    private InterfaceColecaoCategoria repositorioCategoria;
    
    @Test
    void fazerVendaProdutoIndisponivelTest() {

        Produto produto = new Produto();
        produto.setDisponivelParaVenda(false);

        Venda venda = new Venda();

        assertThrows(
            ProdutoIndisponivelException.class,
            () -> fachada.fazerVenda(venda, produto, 1)
        );
    }

    @Test
    void fazerVendaDeveBaixarEstoqueTest() throws Exception {

        Categoria categoria = new Categoria();
        categoria.setNome("Categoria Teste");
        categoria = repositorioCategoria.save(categoria);

        Produto produto = new Produto();

        produto.setNome("Produto Teste");
        produto.setDescricaoProduto("Produto para teste");
        produto.setPreco(10.0);
        produto.setQuantidadeDisponivel(10);
        produto.setDisponivelParaVenda(true);
        produto.setCategoria(categoria);

        produto = repositorioProduto.save(produto);

        Venda venda = new Venda();
        venda.setDataVenda(java.time.LocalDate.now());

        fachada.fazerVenda(venda, produto, 3);

        Produto produtoDoBanco = repositorioProduto
                .findById(produto.getId())
                .orElseThrow();

        assertEquals(7, produtoDoBanco.getQuantidadeDisponivel());
    }

    
    @Test
    void avaliarProprioUsuarioTest() {

        Usuario usuario = new Usuario("Teste", "teste@ufape.edu.br", "123", null, "Computação", null, null);

        usuario.setId(2);

        Avaliacao avaliacao = new Avaliacao(5, "Boa!", usuario, usuario);

        assertThrows(UsuarioNaoPodeSeAvaliarException.class,
        		() -> fachada.avaliarProduto(avaliacao)
        );
    }
    
    @Test
    void deletarVendaDeveReporEstoqueTest() throws Exception {

    	Categoria categoria = new Categoria();
    	categoria.setNome("Categoria Teste Exclusao");
    	categoria = repositorioCategoria.save(categoria);

    	Produto produto = new Produto();

    	produto.setNome("Produto Teste Exclusao");
    	produto.setDescricaoProduto("Produto para teste de exclusao");
    	produto.setPreco(10.0);
    	produto.setQuantidadeDisponivel(10);
    	produto.setDisponivelParaVenda(true);
    	produto.setCategoria(categoria);

    	produto = repositorioProduto.save(produto);

        Venda venda = new Venda();
        venda.setDataVenda(java.time.LocalDate.now());

        fachada.fazerVenda(venda, produto, 3);

        Produto produtoAposVenda = repositorioProduto
                .findById(produto.getId())
                .orElseThrow();

        assertEquals(7, produtoAposVenda.getQuantidadeDisponivel());

        fachada.deletarVendaId(venda.getId());

        Produto produtoAposExclusao = repositorioProduto
                .findById(produto.getId())
                .orElseThrow();

        assertEquals(10, produtoAposExclusao.getQuantidadeDisponivel());
        assertEquals(true, produtoAposExclusao.getDisponivelParaVenda());
    }
    
    @Test
    void deletarVendaNaoDeveAlterarDisponibilidadeDoProduto() throws Exception {

        Categoria categoria = new Categoria();
        categoria.setNome("Categoria Disponibilidade");
        categoria = repositorioCategoria.save(categoria);

        Produto produto = new Produto();

        produto.setNome("Produto Disponibilidade");
        produto.setDescricaoProduto("Produto para teste de disponibilidade");
        produto.setPreco(10.0);
        produto.setQuantidadeDisponivel(10);
        produto.setDisponivelParaVenda(true);
        produto.setCategoria(categoria);

        produto = repositorioProduto.save(produto);

        Venda venda = new Venda();
        venda.setDataVenda(java.time.LocalDate.now());

        fachada.fazerVenda(venda, produto, 3);

        assertEquals(true, produto.getDisponivelParaVenda());

        produto.alterarDisponibilidade(false);
        repositorioProduto.save(produto);

        fachada.deletarVendaId(venda.getId());

        Produto produtoAposExclusao = repositorioProduto
                .findById(produto.getId())
                .orElseThrow();

        assertEquals(10, produtoAposExclusao.getQuantidadeDisponivel());
        assertEquals(false, produtoAposExclusao.getDisponivelParaVenda());
    }
}