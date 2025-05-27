package com.pontofacil.usuarioservice.controller;

import java.time.OffsetDateTime;

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
import com.pontofacil.usuarioservice.model.Usuario;
import com.pontofacil.usuarioservice.service.SupabaseAuthService;
import com.pontofacil.usuarioservice.service.SupabaseService;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final SupabaseService supabaseService;
    private final SupabaseAuthService supabaseAuthService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AdminController(SupabaseService supabaseService, SupabaseAuthService supabaseAuthService) {
        this.supabaseService = supabaseService;
        this.supabaseAuthService = supabaseAuthService;
    }

    @GetMapping("/usuarios")
    public ResponseEntity<JsonNode> listarUsuarios() {
        String response = supabaseService.listarUsuarios();
        JsonNode json = parseJson(response);
        return ResponseEntity.ok(json);
    }

    @PostMapping("/cadastrar-usuario")
    public ResponseEntity<String> cadastrarUsuario(@RequestBody String body) {
        try {
            JsonNode json = parseJson(body);
            String email = json.get("email").asText();
            String senha = json.get("senha").asText();
            String nome = json.get("nome").asText();
            String tipoUsuario = json.get("tipo_usuario").asText();

            // 1. Cria usuário no Auth
            String authId = supabaseAuthService.criarUsuarioAuth(email, senha);

            // 2. Cria modelo para registrar na tabela usuarios
            Usuario usuario = new Usuario();
            usuario.setAuthId(authId);
            usuario.setEmail(email);
            usuario.setNome(nome);
            usuario.setTipoUsuario(tipoUsuario);
            usuario.setCriadoEm(OffsetDateTime.now());

            // 3. Salva na tabela
            supabaseService.cadastrarUsuario(authId, usuario);

            return ResponseEntity.ok("Usuário cadastrado com sucesso!");
        } catch (Exception e) {
             e.printStackTrace();
            return ResponseEntity.status(500).body("Erro ao cadastrar usuário: " + e.getMessage());
        }
    }

    @PutMapping("/usuarios/{id}")
public ResponseEntity<String> atualizarUsuario(@PathVariable String id, @RequestBody String body) {
    try {
        JsonNode json = parseJson(body);
        String novoEmail = json.get("email").asText();

        // Buscar auth_id do usuário
        String lista = supabaseService.listarUsuarios();
        JsonNode usuarios = parseJson(lista);
        JsonNode usuario = null;

        for (JsonNode u : usuarios) {
            if (u.get("id").asText().equals(id)) {
                usuario = u;
                break;
            }
        }

        if (usuario == null) {
            return ResponseEntity.status(404).body("Usuário não encontrado");
        }

        String authId = usuario.get("auth_id").asText();
        String emailAtual = usuario.get("email").asText();

        // Se o e-mail mudou, atualiza no Auth
        if (!emailAtual.equals(novoEmail)) {
            supabaseAuthService.atualizarEmailAuth(authId, novoEmail);
        }

        // Atualiza na tabela usuarios
        String response = supabaseService.atualizarUsuario(id, json);
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(500).body("Erro ao atualizar usuário: " + e.getMessage());
    }
}

    @DeleteMapping("/usuarios/{id}")
public ResponseEntity<String> deletarUsuario(@PathVariable String id) {
    try {
        // 1. Buscar o usuário para pegar o auth_id
        String lista = supabaseService.listarUsuarios(); // retorna JSON
        JsonNode usuarios = parseJson(lista);
        JsonNode usuario = null;

        for (JsonNode u : usuarios) {
            if (u.get("id").asText().equals(id)) {
                usuario = u;
                break;
            }
        }

        if (usuario == null) {
            return ResponseEntity.status(404).body("Usuário não encontrado");
        }

        String authId = usuario.get("auth_id").asText();

        // 2. Deletar do Auth
        supabaseAuthService.deletarUsuarioAuth(authId);

        // 3. Deletar da tabela
        String response = supabaseService.deletarUsuario(id);
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(500).body("Erro ao deletar usuário: " + e.getMessage());
    }
}

    private JsonNode parseJson(String json) {
        try {
            return objectMapper.readTree(json);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao converter JSON", e);
        }
    }
}
