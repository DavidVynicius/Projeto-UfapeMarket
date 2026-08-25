package br.edu.ufape.poo.UfapeMarket.negocio.cadastro;

import java.util.List;
import java.util.Optional;

import br.edu.ufape.poo.UfapeMarket.negocio.basica.Notificacao;

public interface InterfaceCadastroNotificacao {

    Notificacao salvarNotificacao(Notificacao notificacao);

    List<Notificacao> listarNotificacoes();

    Optional<Notificacao> procurarNotificacaoID(Long id);

    void deletarNotificacaoId(Long id);

    void marcarComoLida(Long id);
}