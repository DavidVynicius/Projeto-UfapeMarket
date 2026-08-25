package br.edu.ufape.poo.UfapeMarket.comunicacao.conversor;

import org.springframework.stereotype.Component;

import br.edu.ufape.poo.UfapeMarket.comunicacao.dto.request.ChatDTORequest;
import br.edu.ufape.poo.UfapeMarket.comunicacao.dto.response.ChatDTOResponse;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Chat;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Produto;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Usuario;

@Component
public class ChatConversor {

    public Chat paraEntidade(
            ChatDTORequest request,
            Produto produto,
            Usuario vendedor,
            Usuario comprador) {

        Chat chat = new Chat();

        chat.setProduto(produto);
        chat.setVendedor(vendedor);
        chat.setComprador(comprador);

        return chat;
    }

    public ChatDTOResponse paraResponse(Chat chat) {

        return new ChatDTOResponse(
                chat.getId(),
                chat.getProduto().getId(),
                chat.getVendedor().getId(),
                chat.getComprador().getId()
        );
    }
}