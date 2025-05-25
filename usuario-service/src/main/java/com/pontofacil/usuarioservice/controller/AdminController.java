package com.pontofacil.usuarioservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pontofacil.usuarioservice.service.SupabaseService;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final SupabaseService supabaseService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AdminController(SupabaseService supabaseService) {
        this.supabaseService = supabaseService;
    }

    @GetMapping("/usuarios")
    public ResponseEntity<JsonNode> listarUsuarios() {
        String response = supabaseService.listarUsuarios();
        JsonNode json = parseJson(response); // já tem esse método
        return ResponseEntity.ok(json);
}

    @PostMapping("/cadastrar-usuario")
    public ResponseEntity<String> cadastrarUsuario(@RequestBody String body) {
        JsonNode json = parseJson(body);
        String response = supabaseService.cadastrarUsuario(json);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/usuarios/{id}")
    public ResponseEntity<String> atualizarUsuario(@PathVariable String id, @RequestBody String body) {
        JsonNode json = parseJson(body);
        String response = supabaseService.atualizarUsuario(id, json);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<String> deletarUsuario(@PathVariable String id) {
        String response = supabaseService.deletarUsuario(id);
        return ResponseEntity.ok(response);
    }

    private JsonNode parseJson(String json) {
        try {
            return objectMapper.readTree(json);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao converter JSON", e);
        }
    }
}
