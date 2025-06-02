package com.pontofacil.registroservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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

    @GetMapping("/ping")
    public String ping() {
        return "Registro-service online";
    }
}
