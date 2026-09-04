package br.edu.ufape.poo.UfapeMarket;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import br.edu.ufape.poo.UfapeMarket.dados.InterfaceRepositorioUsuario;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Usuario;

@SpringBootTest
class InterfaceColecaoUsuarioTest {
	@Autowired
	private InterfaceRepositorioUsuario colecaoUsuario;
	
	@Test
	void salvarUsuarioTest() {
	    long quantidadeAntes = colecaoUsuario.count();

	    Usuario usuario = new Usuario(
	            "Arthur",
	            "arthurbr2030@gmail.com",
	            "123",
	            null,
	            "BCC",
	            null,
	            null
	    );

	    Usuario salvo = colecaoUsuario.save(usuario);

	    long quantidadeDepois = colecaoUsuario.count();

	    assertNotNull(salvo);
	    assertNotNull(salvo.getId());
	    assertEquals(quantidadeAntes + 1, quantidadeDepois);
	}
}