package com.pontofacil.registroservice.service;

import com.pontofacil.registroservice.model.RegistroPonto;
import com.pontofacil.registroservice.service.strategy.EntradaStrategy;
import com.pontofacil.registroservice.service.strategy.RegistroStrategy;
import com.pontofacil.registroservice.service.strategy.SaidaStrategy;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;

@Component
public class RegistroFactory {

    private final SupabaseService supabaseService;

    public RegistroFactory(SupabaseService supabaseService) {
        this.supabaseService = supabaseService;
    }

    public RegistroPonto criarRegistro(String usuarioId) {
        RegistroPonto ultimo = supabaseService.buscarUltimoRegistro(usuarioId);

        RegistroStrategy strategy;
        if (ultimo == null || "saida".equalsIgnoreCase(ultimo.getTipo())) {
            strategy = new EntradaStrategy();
        } else {
            strategy = new SaidaStrategy();
        }

        RegistroPonto novo = new RegistroPonto();
        novo.setUsuarioId(usuarioId);
        novo.setDataHora(OffsetDateTime.now());
        novo.setTipo(strategy.definirTipo());

        return novo;
    }
}
