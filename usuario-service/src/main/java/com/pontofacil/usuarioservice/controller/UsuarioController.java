package com.pontofacil.usuarioservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pontofacil.usuarioservice.service.SupabaseService;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final SupabaseService supabaseService;

    public UsuarioController(SupabaseService supabaseService) {
        this.supabaseService = supabaseService;
    }

    @GetMapping
    public String listarUsuarios() {
        return supabaseService.listarUsuarios();
    }

    @GetMapping("/ping")
    public String ping() {
        return "Usuario-service online";
    }
}
