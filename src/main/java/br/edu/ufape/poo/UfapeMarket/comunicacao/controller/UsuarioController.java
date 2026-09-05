package br.edu.ufape.poo.UfapeMarket.comunicacao.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.edu.ufape.poo.UfapeMarket.comunicacao.conversor.UsuarioConversor;
import br.edu.ufape.poo.UfapeMarket.comunicacao.dto.request.LoginDTORequest;
import br.edu.ufape.poo.UfapeMarket.comunicacao.dto.request.UsuarioDTORequest;
import br.edu.ufape.poo.UfapeMarket.comunicacao.dto.response.UsuarioDTOResponse;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Usuario;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.*;
import br.edu.ufape.poo.UfapeMarket.negocio.fachada.UfapeMarket;
import br.edu.ufape.poo.UfapeMarket.negocio.servico.JwtUtil; 
import jakarta.validation.Valid;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UfapeMarket fachada;

    @Autowired
    private UsuarioConversor conversor;

    @Autowired
    private JwtUtil jwtUtil; // Injeção do gerador de token JWT

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

    // --- NOVA ROTA DE LOGIN COM JWT ---
    @PostMapping("/login")
    public ResponseEntity<?> fazerLogin(@Valid @RequestBody LoginDTORequest request) {
        try {
            List<Usuario> usuarios = fachada.listarUsuarios();
            
            // Busca o usuário pelo e-mail institucional
            Usuario usuario = usuarios.stream()
                .filter(u -> u.getEmailInstitucional() != null && u.getEmailInstitucional().equalsIgnoreCase(request.email()))
                .findFirst()
                .orElse(null);

            if (usuario == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("E-mail não cadastrado no sistema.");
            }

            // Valida a senha
            if (usuario.getSenha() == null || !usuario.getSenha().equals(request.senha())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Senha incorreta.");
            }

            // Gera o token JWT usando o e-mail do usuário
            String token = jwtUtil.gerarToken(usuario.getEmailInstitucional());

            // Monta a resposta contendo o token e os dados do usuário convertidos para DTO
            Map<String, Object> resposta = new HashMap<>();
            resposta.put("token", token);
            resposta.put("usuario", conversor.paraResponse(usuario));

            return ResponseEntity.ok(resposta);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro interno no servidor: " + e.getMessage());
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTOResponse> procurarUsuario(
            @PathVariable Long id)
            throws UsuarioNaoEncontradoException {

        Usuario usuario = fachada.procurarUsuarioID(id);
        return ResponseEntity.ok(conversor.paraResponse(usuario));
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
        return ResponseEntity.ok(conversor.paraResponse(atualizado));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarUsuario(
            @PathVariable Long id)
            throws UsuarioNaoEncontradoException {

        fachada.deletarUsuarioId(id);
        return ResponseEntity.noContent().build();
    }
}