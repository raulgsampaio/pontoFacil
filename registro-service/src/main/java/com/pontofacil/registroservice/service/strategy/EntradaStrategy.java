package com.pontofacil.registroservice.service.strategy;

public class EntradaStrategy implements RegistroStrategy {
    @Override
    public String definirTipo() {
        return "entrada";
    }
}
