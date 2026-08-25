package br.edu.ufape.poo.UfapeMarket.comunicacao.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.ufape.poo.UfapeMarket.comunicacao.conversor.MensagemConversor;
import br.edu.ufape.poo.UfapeMarket.comunicacao.dto.request.MensagemDTORequest;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Mensagem;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.MensagemVaziaException;
import br.edu.ufape.poo.UfapeMarket.negocio.fachada.InterfaceFachada;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/mensagens")
public class MensagemController {

    @Autowired
    private InterfaceFachada fachada;

    @Autowired
    private MensagemConversor conversor;

    @PostMapping
    public ResponseEntity<?> enviarMensagem(@Valid @RequestBody MensagemDTORequest dto) {
        try {
            Mensagem mensagem = conversor.requestToEntity(dto);
            Mensagem enviada = fachada.enviarMensagem(mensagem);
            return ResponseEntity.status(HttpStatus.CREATED).body(conversor.entityToResponse(enviada));
        } catch (MensagemVaziaException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removerMensagem(@PathVariable Long id) {
        fachada.removerMensagemId(id);
        return ResponseEntity.noContent().build();
    }
}