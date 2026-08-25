package br.edu.ufape.poo.UfapeMarket.comunicacao.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.ProdutoNaoEncontradoException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.UsuarioNaoEncontradoException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.VendaNaoEncontradaException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.ProdutoNomeObrigatorioException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.ProdutoDescricaoObrigatoriaException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.ProdutoPrecoInvalidoException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.ProdutoQuantidadeInvalidaException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.ProdutoCategoriaObrigatoriaException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.VendaDataObrigatoriaException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.VendaProdutoObrigatorioException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.ProdutoEstoqueInsuficienteException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.ProdutoIndisponivelException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UsuarioNaoEncontradoException.class)
    public ResponseEntity<String> usuarioNaoEncontrado(
            UsuarioNaoEncontradoException e) {

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(e.getMessage());
    }
    
    @ExceptionHandler(ProdutoNaoEncontradoException.class)
    public ResponseEntity<String> produtoNaoEncontrado(
            ProdutoNaoEncontradoException e) {

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(e.getMessage());
    }
    
    @ExceptionHandler(VendaNaoEncontradaException.class)
    public ResponseEntity<String> vendaNaoEncontrada(
            VendaNaoEncontradaException e) {

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(e.getMessage());
    }
    
    @ExceptionHandler({
        ProdutoNomeObrigatorioException.class,
        ProdutoDescricaoObrigatoriaException.class,
        ProdutoPrecoInvalidoException.class,
        ProdutoQuantidadeInvalidaException.class,
        ProdutoCategoriaObrigatoriaException.class
    })
    public ResponseEntity<String> erroProduto(Exception e) {

    return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(e.getMessage());
    }
    
    @ExceptionHandler({
        VendaDataObrigatoriaException.class,
        VendaProdutoObrigatorioException.class,
        ProdutoEstoqueInsuficienteException.class,
        ProdutoIndisponivelException.class
    })
    public ResponseEntity<String> erroVenda(Exception e) {

    return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(e.getMessage());
    }
    
    
}