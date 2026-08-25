package br.edu.ufape.poo.UfapeMarket.comunicacao.conversor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import br.edu.ufape.poo.UfapeMarket.comunicacao.dto.request.NotificacaoDTORequest;
import br.edu.ufape.poo.UfapeMarket.comunicacao.dto.response.NotificacaoDTOResponse;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Notificacao;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Usuario;
import br.edu.ufape.poo.UfapeMarket.negocio.fachada.UfapeMarket;

@Component
public class NotificacaoConversor {

    @Autowired
    private UfapeMarket fachada;

    public Notificacao paraEntidade(NotificacaoDTORequest request) {

        Usuario destinatario =
                fachada.procurarUsuarioID(request.destinatarioId());

        return new Notificacao(
                0,
                request.titulo(),
                request.mensagem(),
                request.dataHora(),
                request.lida(),
                destinatario
        );
    }

    public NotificacaoDTOResponse paraResponse(Notificacao notificacao) {

        return new NotificacaoDTOResponse(
                notificacao.getId(),
                notificacao.getTitulo(),
                notificacao.getMensagem(),
                notificacao.getDataHora(),
                notificacao.getLida(),
                notificacao.getDestinatario().getId()
        );
    }
}