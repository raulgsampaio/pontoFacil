package com.pontofacil.registroservice.service.strategy;

public class SaidaStrategy implements RegistroStrategy {
    @Override
    public String definirTipo() {
        return "saida";
    }
}
