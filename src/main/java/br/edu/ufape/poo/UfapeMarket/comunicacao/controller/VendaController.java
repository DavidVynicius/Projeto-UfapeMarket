package br.edu.ufape.poo.UfapeMarket.comunicacao.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import br.edu.ufape.poo.UfapeMarket.comunicacao.conversor.VendaConversor;
import br.edu.ufape.poo.UfapeMarket.negocio.fachada.UfapeMarket;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

import br.edu.ufape.poo.UfapeMarket.comunicacao.dto.response.VendaDTOResponse;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Venda;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import br.edu.ufape.poo.UfapeMarket.comunicacao.dto.request.VendaDTORequest;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Produto;

import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.VendaDataObrigatoriaException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.VendaProdutoObrigatorioException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.ProdutoQuantidadeInvalidaException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.ProdutoEstoqueInsuficienteException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.ProdutoIndisponivelException;

import jakarta.validation.Valid;
@RestController
@RequestMapping("/vendas")
public class VendaController {

    @Autowired
    private UfapeMarket fachada;

    @Autowired
    private VendaConversor conversor;
    
    @GetMapping
    public ResponseEntity<List<VendaDTOResponse>> listarVendas() {

        List<Venda> vendas = fachada.listarVendas();

        List<VendaDTOResponse> resposta = vendas.stream()
                .map(conversor::paraResponse)
                .toList();

        return ResponseEntity.ok(resposta);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<VendaDTOResponse> procurarVenda(
            @PathVariable Long id) {

        Venda venda = fachada.procurarVendaID(id);

        return ResponseEntity.ok(
                conversor.paraResponse(venda)
        );
    }
    
    @PostMapping
    public ResponseEntity<VendaDTOResponse> salvarVenda(
            @Valid @RequestBody VendaDTORequest request)
            throws VendaDataObrigatoriaException,
                   VendaProdutoObrigatorioException,
                   ProdutoQuantidadeInvalidaException,
                   ProdutoEstoqueInsuficienteException,
                   ProdutoIndisponivelException {

        Venda venda = conversor.paraEntidade(request);

        Produto produto = fachada.procurarProdutoID(request.idProduto());

        venda.setProduto(produto);

        fachada.fazerVenda(
                venda,
                produto,
                request.quantidadeVendida()
        );

        Venda salva = fachada.salvarVenda(venda);

        return ResponseEntity.ok(
                conversor.paraResponse(salva)
        );
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<VendaDTOResponse> atualizarVenda(
            @PathVariable Long id,
            @Valid @RequestBody VendaDTORequest request)
            throws VendaDataObrigatoriaException,
                   VendaProdutoObrigatorioException,
                   ProdutoQuantidadeInvalidaException {

        Venda venda = fachada.procurarVendaID(id);

        Produto produto = fachada.procurarProdutoID(request.idProduto());

        venda.setDataVenda(request.dataVenda());
        venda.setQuantidadeVendida(request.quantidadeVendida());
        venda.setProduto(produto);

        Venda atualizada = fachada.salvarVenda(venda);

        return ResponseEntity.ok(
                conversor.paraResponse(atualizada)
        );
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarVenda(
            @PathVariable Long id) {

        fachada.deletarVendaId(id);

        return ResponseEntity.noContent().build();
    }

}