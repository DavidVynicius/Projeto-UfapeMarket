package br.edu.ufape.poo.UfapeMarket.comunicacao.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.edu.ufape.poo.UfapeMarket.comunicacao.conversor.UsuarioConversor;
import br.edu.ufape.poo.UfapeMarket.comunicacao.dto.request.UsuarioDTORequest;
import br.edu.ufape.poo.UfapeMarket.comunicacao.dto.response.UsuarioDTOResponse;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Usuario;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.UsuarioEmailInvalidoException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.UsuarioEmailJaCadastradoException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.UsuarioNaoEncontradoException;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.UsuarioNomeObrigatorioException;
import br.edu.ufape.poo.UfapeMarket.negocio.fachada.UfapeMarket;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UfapeMarket fachada;

    @Autowired
    private UsuarioConversor conversor;

    
    @GetMapping
    public ResponseEntity<List<UsuarioDTOResponse>> listarUsuarios() {

        List<Usuario> usuarios = fachada.listarUsuarios();

        List<UsuarioDTOResponse> resposta = usuarios.stream()
                .map(conversor::paraResponse)
                .toList();

        return ResponseEntity.ok(resposta); 
    }
    
    @PostMapping
    public ResponseEntity<UsuarioDTOResponse> salvarUsuario(
            @Valid @RequestBody UsuarioDTORequest request) throws UsuarioNomeObrigatorioException, UsuarioEmailInvalidoException, UsuarioEmailJaCadastradoException {

        Usuario usuario = conversor.paraEntidade(request);

        Usuario salvo = fachada.salvarUsuario(usuario);

        UsuarioDTOResponse resposta = conversor.paraResponse(salvo);

        return ResponseEntity.ok(resposta);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTOResponse> procurarUsuario(
            @PathVariable Long id)
            throws UsuarioNaoEncontradoException {

        Usuario usuario = fachada.procurarUsuarioID(id);

        return ResponseEntity.ok(
                conversor.paraResponse(usuario)
        );
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDTOResponse> atualizarUsuario(
            @PathVariable Long id,
            @Valid @RequestBody UsuarioDTORequest request)
            throws UsuarioNaoEncontradoException,
                   UsuarioNomeObrigatorioException,
                   UsuarioEmailInvalidoException,
                   UsuarioEmailJaCadastradoException {

        Usuario usuario = fachada.procurarUsuarioID(id);

        Usuario dadosAtualizados = conversor.paraEntidade(request);

        usuario.setNome(dadosAtualizados.getNome());
        usuario.setEmailInstitucional(dadosAtualizados.getEmailInstitucional());
        usuario.setSenha(dadosAtualizados.getSenha());
        usuario.setDataNascimento(dadosAtualizados.getDataNascimento());
        usuario.setCurso(dadosAtualizados.getCurso());
        usuario.setFotoPerfil(dadosAtualizados.getFotoPerfil());
        usuario.setBiografia(dadosAtualizados.getBiografia());

        Usuario atualizado = fachada.salvarUsuario(usuario);

        return ResponseEntity.ok(
                conversor.paraResponse(atualizado)
        );
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarUsuario(
            @PathVariable Long id)
            throws UsuarioNaoEncontradoException {

        fachada.deletarUsuarioId(id);

        return ResponseEntity.noContent().build();
    }
    
}