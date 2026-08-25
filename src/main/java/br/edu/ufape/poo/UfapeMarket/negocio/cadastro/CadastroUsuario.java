package br.edu.ufape.poo.UfapeMarket.negocio.cadastro;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.edu.ufape.poo.UfapeMarket.negocio.basica.Usuario;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.UsuarioEmailInvalidoException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.UsuarioEmailJaCadastradoException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.UsuarioNaoEncontradoException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.UsuarioNomeObrigatorioException;
import br.edu.ufape.poo.UfapeMarket.dados.InterfaceRepositorioUsuario;

@Service
public class CadastroUsuario implements InterfaceCadastroUsuario {
	@Autowired
	private InterfaceRepositorioUsuario repositorioUsuario;
	
	@Override
	public Usuario salvarUsuario(Usuario usuario)        
			throws UsuarioNomeObrigatorioException,
			UsuarioEmailInvalidoException,
			UsuarioEmailJaCadastradoException  {
		
	    if (usuario == null) {
	        throw new IllegalArgumentException("Usuário não pode ser nulo.");
	    }
	    if(usuario.getNome() == null || usuario.getNome().isBlank()){
	    	throw new UsuarioNomeObrigatorioException();
	    }
		
	    if (usuario.getEmailInstitucional() == null ||
	            usuario.getEmailInstitucional().isBlank()) {

	            throw new UsuarioEmailInvalidoException(usuario.getEmailInstitucional());
	        }
	    
	    if(!usuario.getEmailInstitucional().endsWith("@ufape.edu.br")){
	    	throw new UsuarioEmailInvalidoException(usuario.getEmailInstitucional());
	    }
	    
	    if (repositorioUsuario.findByEmailInstitucional(
	            usuario.getEmailInstitucional()) != null) {

	        throw new UsuarioEmailJaCadastradoException(
	                usuario.getEmailInstitucional());
	    }

		
		
		
		return repositorioUsuario.save(usuario);
	}

	@Override
	public List<Usuario>  listarUsuarios() {
		return repositorioUsuario.findAll();
	}


	@Override
	public Usuario localizarUsuarioEmail(String emailInstitucional) {
		return repositorioUsuario.findByEmailInstitucional(emailInstitucional);
	}

	@Override
	public Optional<Usuario> procurarUsuarioID(Long id)
			throws UsuarioNaoEncontradoException {
		return Optional.of(repositorioUsuario.findById(id).orElseThrow(() -> new UsuarioNaoEncontradoException(id)));
	}

	@Override
	public void deletarUsuarioId(Long id) {

	    Usuario usuario =
	        repositorioUsuario.findById(id)
	        .orElseThrow(() ->
	            new UsuarioNaoEncontradoException(id));

	    repositorioUsuario.delete(usuario);
	}
	
	
}
