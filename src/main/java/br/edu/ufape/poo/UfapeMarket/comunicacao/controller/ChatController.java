package br.edu.ufape.poo.UfapeMarket.comunicacao.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.edu.ufape.poo.UfapeMarket.comunicacao.conversor.ChatConversor;
import br.edu.ufape.poo.UfapeMarket.comunicacao.dto.request.ChatDTORequest;
import br.edu.ufape.poo.UfapeMarket.comunicacao.dto.response.ChatDTOResponse;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Chat;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Produto;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Usuario;
import br.edu.ufape.poo.UfapeMarket.negocio.fachada.UfapeMarket;

@RestController
@RequestMapping("/chats")
public class ChatController {

    @Autowired
    private UfapeMarket fachada;

    @Autowired
    private ChatConversor conversor;

    @PostMapping
    public ResponseEntity<ChatDTOResponse> criarChat(
            @RequestBody ChatDTORequest request) {

        Usuario vendedor = fachada.procurarUsuarioID(request.vendedorId());
        Usuario comprador = fachada.procurarUsuarioID(request.compradorId());
        Produto produto = fachada.procurarProdutoID(request.produtoId());

        Chat chat = conversor.paraEntidade(
                request,
                produto,
                vendedor,
                comprador
        );

        Chat salvo = fachada.salvarChat(chat);

        return ResponseEntity.ok(
                conversor.paraResponse(salvo)
        );
    }

    @GetMapping
    public ResponseEntity<List<ChatDTOResponse>> listarChats() {

        List<ChatDTOResponse> resposta =
                fachada.listarChats()
                       .stream()
                       .map(conversor::paraResponse)
                       .toList();

        return ResponseEntity.ok(resposta);
    }
}