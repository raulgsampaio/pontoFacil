package com.pontofacil.registroservice.service;

import java.time.OffsetDateTime;
import java.time.ZoneId;

import org.springframework.stereotype.Component;

import com.pontofacil.registroservice.model.RegistroPonto;
import com.pontofacil.registroservice.service.strategy.EntradaStrategy;
import com.pontofacil.registroservice.service.strategy.RegistroStrategy;
import com.pontofacil.registroservice.service.strategy.SaidaStrategy;

@Component
public class RegistroFactory {

    private final SupabaseService supabaseService;

    public RegistroFactory(SupabaseService supabaseService) {
        this.supabaseService = supabaseService;
    }

    public RegistroPonto criarRegistro(String usuarioAuthId) {
        // buscar o ID real (chave primária) com base no auth_id
        String usuarioId = supabaseService.buscarIdPorAuthId(usuarioAuthId);

        RegistroPonto ultimo = supabaseService.buscarUltimoRegistro(usuarioId);

        RegistroStrategy strategy;
        if (ultimo == null || "saida".equalsIgnoreCase(ultimo.getTipo())) {
            strategy = new EntradaStrategy();
        } else {
            strategy = new SaidaStrategy();
        }

        RegistroPonto novo = new RegistroPonto();
        novo.setUsuarioId(usuarioId);
        novo.setDataHora(OffsetDateTime.now(ZoneId.of("America/Fortaleza")));
        novo.setTipo(strategy.definirTipo());

        return novo;
    }
}
