package com.pontofacil.registroservice.controller;

import java.time.OffsetDateTime;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pontofacil.registroservice.model.RegistroPonto;
import com.pontofacil.registroservice.service.RegistroFactory;
import com.pontofacil.registroservice.service.SupabaseService;

@RestController
@RequestMapping(value = "/registros", produces = "application/json")
public class RegistroPontoController {

    private final SupabaseService supabaseService;
    private final RegistroFactory registroFactory;
    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();

    public RegistroPontoController(SupabaseService supabaseService, RegistroFactory registroFactory) {
        this.supabaseService = supabaseService;
        this.registroFactory = registroFactory;
    }

    @PostMapping("/{usuarioId}")
    public ResponseEntity<String> registrarPonto(@PathVariable String usuarioId) {
        try {
            RegistroPonto novoRegistro = registroFactory.criarRegistro(usuarioId);
            supabaseService.salvarRegistro(novoRegistro);
            return ResponseEntity.ok("Registro criado com sucesso.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erro ao registrar ponto: " + e.getMessage());
        }
    }

    @PostMapping("/manual")
    public ResponseEntity<String> registrarManual(@RequestBody String body) {
        try {
            com.fasterxml.jackson.databind.JsonNode json = objectMapper.readTree(body);
            RegistroPonto reg = new RegistroPonto();
            reg.setUsuarioId(json.get("usuario_id").asText());
            reg.setTipo(json.get("tipo").asText());
            reg.setDataHora(OffsetDateTime.parse(json.get("data_hora").asText()));
            supabaseService.salvarRegistro(reg);
            return ResponseEntity.ok("Registro criado com sucesso.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erro ao registrar ponto: " + e.getMessage());
        }
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<String> listarPorUsuario(@PathVariable String usuarioId) {
        try {
            String registros = supabaseService.listarRegistrosPorUsuario(usuarioId);
            return ResponseEntity.ok(registros);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao listar registros");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> atualizarRegistro(@PathVariable String id, @RequestBody String body) {
        try {
            com.fasterxml.jackson.databind.JsonNode json = objectMapper.readTree(body);
            String res = supabaseService.atualizarRegistro(id, json);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erro ao atualizar registro");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletarRegistro(@PathVariable String id) {
        try {
            String res = supabaseService.deletarRegistro(id);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erro ao deletar registro");
        }
    }

    @GetMapping("/ping")
    public String ping() {
        return "Registro-service online";
    }
}
