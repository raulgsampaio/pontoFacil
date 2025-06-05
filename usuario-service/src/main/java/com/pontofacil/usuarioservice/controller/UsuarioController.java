package com.pontofacil.usuarioservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

    @GetMapping("/{id}")
    public String buscarUsuario(@PathVariable String id) {
        return supabaseService.buscarUsuarioPorId(id);
    }

    @GetMapping("/auth/{authId}")
    public String buscarPorAuth(@PathVariable String authId) {
        return supabaseService.buscarUsuarioPorAuthId(authId);
    }

    @GetMapping("/funcionarios")
    public String listarFuncionarios() {
        return supabaseService.listarFuncionarios();
    }

    @GetMapping("/ping")
    public String ping() {
        return "Usuario-service online";
    }
}
