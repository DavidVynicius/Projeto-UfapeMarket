package br.edu.ufape.poo.UfapeMarket.comunicacao.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.edu.ufape.poo.UfapeMarket.comunicacao.conversor.AvaliacaoConversor;
import br.edu.ufape.poo.UfapeMarket.comunicacao.dto.request.AvaliacaoDTORequest;
import br.edu.ufape.poo.UfapeMarket.comunicacao.dto.response.AvaliacaoDTOResponse;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Avaliacao;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.UsuarioNaoPodeSeAvaliarException;
import br.edu.ufape.poo.UfapeMarket.negocio.fachada.UfapeMarket;

@RestController
@RequestMapping("/avaliacoes")
public class AvaliacaoController {

    @Autowired
    private UfapeMarket fachada;

    @Autowired
    private AvaliacaoConversor conversor;

    @GetMapping
    public ResponseEntity<List<AvaliacaoDTOResponse>> listarAvaliacoes() {

        List<Avaliacao> avaliacoes = fachada.listarAvaliacoes();

        List<AvaliacaoDTOResponse> resposta = avaliacoes.stream()
                .map(conversor::paraResponse)
                .toList();

        return ResponseEntity.ok(resposta);
    }

    @PostMapping
    public ResponseEntity<AvaliacaoDTOResponse> salvarAvaliacao(
            @RequestBody AvaliacaoDTORequest request)
            throws UsuarioNaoPodeSeAvaliarException {

        Avaliacao avaliacao = conversor.paraEntidade(request);

        Avaliacao salva = fachada.avaliarProduto(avaliacao);

        return ResponseEntity.ok(
                conversor.paraResponse(salva)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<AvaliacaoDTOResponse> procurarAvaliacao(
            @PathVariable Long id) {

        Avaliacao avaliacao = fachada.procurarAvaliacaoID(id);

        return ResponseEntity.ok(
                conversor.paraResponse(avaliacao)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarAvaliacao(
            @PathVariable Long id) {

        fachada.deletarAvaliacaoId(id);

        return ResponseEntity.noContent().build();
    }
}