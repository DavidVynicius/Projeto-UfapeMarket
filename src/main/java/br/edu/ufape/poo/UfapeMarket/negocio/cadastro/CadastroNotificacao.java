package br.edu.ufape.poo.UfapeMarket.negocio.cadastro;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.edu.ufape.poo.UfapeMarket.dados.InterfaceRepositorioNotificacao;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Notificacao;

@Service
public class CadastroNotificacao implements InterfaceCadastroNotificacao {

    @Autowired
    private InterfaceRepositorioNotificacao repositorioNotificacao;

    @Override
    public Notificacao salvarNotificacao(Notificacao notificacao) {

        if (notificacao == null) {
            throw new IllegalArgumentException("Notificação não pode ser nula.");
        }

        if (notificacao.getTitulo() == null ||
            notificacao.getTitulo().isBlank()) {

            throw new IllegalArgumentException("Título obrigatório.");
        }

        if (notificacao.getDestinatario() == null) {
            throw new IllegalArgumentException("Destinatário obrigatório.");
        }

        if (notificacao.getDataHora() == null) {
            notificacao.setDataHora(LocalDateTime.now());
        }

        return repositorioNotificacao.save(notificacao);
    }

    @Override
    public List<Notificacao> listarNotificacoes() {
        return repositorioNotificacao.findAll();
    }

    @Override
    public Optional<Notificacao> procurarNotificacaoID(Long id) {
        return repositorioNotificacao.findById(id);
    }

    @Override
    public void deletarNotificacaoId(Long id) {
        repositorioNotificacao.deleteById(id);
    }

    @Override
    public void marcarComoLida(Long id) {

        Notificacao notificacao = repositorioNotificacao.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Notificação não encontrada."));

        notificacao.marcarComoLida();

        repositorioNotificacao.save(notificacao);
    }
}