package br.edu.ufape.poo.UfapeMarket.comunicacao.conversor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import br.edu.ufape.poo.UfapeMarket.comunicacao.dto.request.MensagemDTORequest;
import br.edu.ufape.poo.UfapeMarket.comunicacao.dto.response.MensagemDTOResponse;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Chat;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Mensagem;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Usuario;
import br.edu.ufape.poo.UfapeMarket.negocio.fachada.InterfaceFachada;

@Component
public class MensagemConversor {

    @Autowired
    private InterfaceFachada fachada;

    public Mensagem requestToEntity(MensagemDTORequest dto) throws Exception {
        Mensagem mensagem = new Mensagem();
        mensagem.setTexto(dto.texto());

        Usuario remetente = fachada.procurarUsuarioID(dto.remetenteId());
        mensagem.setRemetente(remetente);

        Chat chat = new Chat();
        chat.setId(dto.chatId());
        mensagem.setChat(chat);

        return mensagem;
    }

    public MensagemDTOResponse entityToResponse(Mensagem mensagem) {
        return new MensagemDTOResponse(
            mensagem.getId(),
            mensagem.getTexto(),
            mensagem.getDataHora(),
            mensagem.getRemetente() != null ? mensagem.getRemetente().getId() : null,
            mensagem.getChat() != null ? mensagem.getChat().getId() : null
        );
    }
}