package br.edu.ufape.poo.UfapeMarket.comunicacao.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.edu.ufape.poo.UfapeMarket.comunicacao.conversor.NotificacaoConversor;
import br.edu.ufape.poo.UfapeMarket.comunicacao.dto.request.NotificacaoDTORequest;
import br.edu.ufape.poo.UfapeMarket.comunicacao.dto.response.NotificacaoDTOResponse;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Notificacao;
import br.edu.ufape.poo.UfapeMarket.negocio.fachada.UfapeMarket;

@RestController
@RequestMapping("/notificacoes")
public class NotificacaoController {

    @Autowired
    private UfapeMarket fachada;

    @Autowired
    private NotificacaoConversor conversor;

    @GetMapping
    public ResponseEntity<List<NotificacaoDTOResponse>> listarNotificacoes() {

        List<Notificacao> notificacoes =
                fachada.listarNotificacoes();

        List<NotificacaoDTOResponse> resposta =
                notificacoes.stream()
                        .map(conversor::paraResponse)
                        .toList();

        return ResponseEntity.ok(resposta);
    }

    @PostMapping
    public ResponseEntity<NotificacaoDTOResponse> salvarNotificacao(
            @RequestBody NotificacaoDTORequest request) {

        Notificacao notificacao =
                conversor.paraEntidade(request);

        Notificacao salva =
                fachada.salvarNotificacao(notificacao);

        return ResponseEntity.ok(
                conversor.paraResponse(salva)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<NotificacaoDTOResponse> procurarNotificacao(
            @PathVariable Long id) {

        Notificacao notificacao =
                fachada.procurarNotificacaoID(id);

        return ResponseEntity.ok(
                conversor.paraResponse(notificacao)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarNotificacao(
            @PathVariable Long id) {

        fachada.deletarNotificacaoId(id);

        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/lida")
    public ResponseEntity<Void> marcarComoLida(
            @PathVariable Long id) {

        fachada.marcarNotificacaoComoLida(id);

        return ResponseEntity.noContent().build();
    }
}