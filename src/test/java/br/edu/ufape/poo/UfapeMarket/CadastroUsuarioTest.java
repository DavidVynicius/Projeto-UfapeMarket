package br.edu.ufape.poo.UfapeMarket;

import org.junit.jupiter.api.BeforeEach;
import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDate;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import br.edu.ufape.poo.UfapeMarket.negocio.basica.Usuario;
import br.edu.ufape.poo.UfapeMarket.negocio.cadastro.CadastroUsuario;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.UsuarioEmailInvalidoException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.UsuarioEmailJaCadastradoException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.UsuarioNomeObrigatorioException;

@SpringBootTest
class CadastroUsuarioTest {

    @Autowired
    private CadastroUsuario cadastroUsuario;
    
    @BeforeEach
    void limparUsuariosDeTeste() {

        Usuario usuarioDavid =
                cadastroUsuario.localizarUsuarioEmail(
                        "david_teste_12345@ufape.edu.br");

        if (usuarioDavid != null) {
            cadastroUsuario.deletarUsuarioId(usuarioDavid.getId());
        }

        Usuario usuarioDuplicado =
                cadastroUsuario.localizarUsuarioEmail(
                        "duplicado@ufape.edu.br");

        if (usuarioDuplicado != null) {
            cadastroUsuario.deletarUsuarioId(usuarioDuplicado.getId());
        }
    }

    @Test
    void cadastrarUsuarioTest() throws Exception {

        long quantidadeAntes = cadastroUsuario.listarUsuarios().size();

        Usuario usuario = new Usuario(
                "David",
                "david_teste_12345@ufape.edu.br",
                "12345678",
                LocalDate.of(2004, 5, 15),
                "Ciência da Computação",
                "",
                ""
        );

        cadastroUsuario.salvarUsuario(usuario);

        long quantidadeDepois = cadastroUsuario.listarUsuarios().size();

        assertEquals(quantidadeAntes + 1, quantidadeDepois);
    }

    @Test
    void nomeObrigatorioTest() {

        Usuario usuario = new Usuario(
                "",
                "teste1@ufape.edu.br",
                "12345678",
                LocalDate.of(2004, 5, 15),
                "BCC",
                "",
                ""
        );

        assertThrows(
                UsuarioNomeObrigatorioException.class,
                () -> cadastroUsuario.salvarUsuario(usuario)
        );
    }

    @Test
    void emailInvalidoTest() {

        Usuario usuario = new Usuario(
                "David",
                "teste@gmail.com",
                "12345678",
                LocalDate.of(2004, 5, 15),
                "BCC",
                "",
                ""
        );

        assertThrows(
                UsuarioEmailInvalidoException.class,
                () -> cadastroUsuario.salvarUsuario(usuario)
        );
    }

    @Test
    void emailJaCadastradoTest() throws Exception {

        Usuario usuario1 = new Usuario(
                "David",
                "duplicado@ufape.edu.br",
                "12345678",
                LocalDate.of(2004, 5, 15),
                "BCC",
                "",
                ""
        );

        Usuario usuario2 = new Usuario(
                "João",
                "duplicado@ufape.edu.br",
                "87654321",
                LocalDate.of(2003, 3, 20),
                "Engenharia",
                "",
                ""
        );

        cadastroUsuario.salvarUsuario(usuario1);

        assertThrows(
                UsuarioEmailJaCadastradoException.class,
                () -> cadastroUsuario.salvarUsuario(usuario2)
        );
    }
}