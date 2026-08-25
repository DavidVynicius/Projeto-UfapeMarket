package br.edu.ufape.poo.UfapeMarket.comunicacao.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.ufape.poo.UfapeMarket.comunicacao.conversor.CategoriaConversor;
import br.edu.ufape.poo.UfapeMarket.comunicacao.dto.request.CategoriaDTORequest;
import br.edu.ufape.poo.UfapeMarket.comunicacao.dto.response.CategoriaDTOResponse;
import br.edu.ufape.poo.UfapeMarket.negocio.basica.Categoria;
import br.edu.ufape.poo.UfapeMarket.negocio.excecoes.CategoriaDuplicadaException;
import br.edu.ufape.poo.UfapeMarket.negocio.fachada.InterfaceFachada;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/categorias")
public class CategoriaController {

    @Autowired
    private InterfaceFachada fachada;

    @Autowired
    private CategoriaConversor conversor;

    @PostMapping
    public ResponseEntity<?> salvar(@Valid @RequestBody CategoriaDTORequest dto) {
        try {
            Categoria categoria = conversor.requestToEntity(dto);
            Categoria salva = fachada.salvarCategoria(categoria);
            return ResponseEntity.status(HttpStatus.CREATED).body(conversor.entityToResponse(salva));
        } catch (CategoriaDuplicadaException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<CategoriaDTOResponse>> listarTodas() {
        List<CategoriaDTOResponse> resposta = fachada.listarCategorias().stream()
                .map(conversor::entityToResponse)
                .toList();
        return ResponseEntity.ok(resposta);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        fachada.removerCategoriaId(id);
        return ResponseEntity.noContent().build();
    }
}