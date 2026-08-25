package br.edu.ufape.poo.UfapeMarket.comunicacao.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import br.edu.ufape.poo.UfapeMarket.comunicacao.dto.response.ProdutoDTOResponse;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Produto;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.ufape.poo.UfapeMarket.comunicacao.conversor.ProdutoConversor;
import br.edu.ufape.poo.UfapeMarket.negocio.fachada.UfapeMarket;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import br.edu.ufape.poo.UfapeMarket.comunicacao.dto.request.ProdutoDTORequest;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Categoria;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Usuario;

import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.ProdutoNomeObrigatorioException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.ProdutoDescricaoObrigatoriaException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.ProdutoPrecoInvalidoException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.ProdutoQuantidadeInvalidaException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.ProdutoCategoriaObrigatoriaException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.UsuarioNaoEncontradoException;

import jakarta.validation.Valid;
@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    @Autowired
    private UfapeMarket fachada;

    @Autowired
    private ProdutoConversor conversor;
    
    @GetMapping
    public ResponseEntity<List<ProdutoDTOResponse>> listarProdutos() {

        List<Produto> produtos = fachada.listarProdutos();

        List<ProdutoDTOResponse> resposta = produtos.stream()
                .map(conversor::paraResponse)
                .toList();

        return ResponseEntity.ok(resposta);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ProdutoDTOResponse> procurarProduto(
            @PathVariable Long id) {

        Produto produto = fachada.procurarProdutoID(id);

        return ResponseEntity.ok(
                conversor.paraResponse(produto)
        );
    }
    
    @PostMapping
    public ResponseEntity<ProdutoDTOResponse> salvarProduto(
            @Valid @RequestBody ProdutoDTORequest request)
            throws ProdutoNomeObrigatorioException,
                   ProdutoDescricaoObrigatoriaException,
                   ProdutoPrecoInvalidoException,
                   ProdutoQuantidadeInvalidaException,
                   ProdutoCategoriaObrigatoriaException,
                   UsuarioNaoEncontradoException {

        Produto produto = conversor.paraEntidade(request);

        Categoria categoria = fachada.procurarCategoriaID(request.idCategoria());

        Usuario vendedor = fachada.procurarUsuarioID(request.idVendedor());

        produto.setCategoria(categoria);
        produto.setVendedor(vendedor);

        Produto salvo = fachada.salvarProduto(produto);

        return ResponseEntity.ok(
                conversor.paraResponse(salvo)
        );
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ProdutoDTOResponse> atualizarProduto(
            @PathVariable Long id,
            @Valid @RequestBody ProdutoDTORequest request)
            throws ProdutoNomeObrigatorioException,
                   ProdutoDescricaoObrigatoriaException,
                   ProdutoPrecoInvalidoException,
                   ProdutoQuantidadeInvalidaException,
                   ProdutoCategoriaObrigatoriaException,
                   UsuarioNaoEncontradoException 
    {

        Produto produto = fachada.procurarProdutoID(id);

        Produto dadosAtualizados = conversor.paraEntidade(request);

        Categoria categoria = fachada.procurarCategoriaID(request.idCategoria());
        Usuario vendedor = fachada.procurarUsuarioID(request.idVendedor());

        produto.setNome(dadosAtualizados.getNome());
        produto.setDescricaoProduto(dadosAtualizados.getDescricaoProduto());
        produto.setFotoProduto(dadosAtualizados.getFotoProduto());
        produto.setPreco(dadosAtualizados.getPreco());
        produto.setDisponivel(dadosAtualizados.isDisponivel());
        produto.setQuantidadeDisponivel(dadosAtualizados.getQuantidadeDisponivel());
        produto.setTurnoDisponibilidade(dadosAtualizados.getTurnoDisponibilidade());
        produto.setFormasPagamento(dadosAtualizados.getFormasPagamento());

        produto.setCategoria(categoria);
        produto.setVendedor(vendedor);

        Produto atualizado = fachada.salvarProduto(produto);

        return ResponseEntity.ok(
                conversor.paraResponse(atualizado)
        );
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarProduto(
            @PathVariable Long id) {

        fachada.deletarProdutoId(id);

        return ResponseEntity.noContent().build();
    }

    }