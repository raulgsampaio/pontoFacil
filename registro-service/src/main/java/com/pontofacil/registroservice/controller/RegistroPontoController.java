package com.pontofacil.registroservice.controller;

import com.pontofacil.registroservice.model.RegistroPonto;
import com.pontofacil.registroservice.service.RegistroFactory;
import com.pontofacil.registroservice.service.SupabaseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/registros")
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
}
