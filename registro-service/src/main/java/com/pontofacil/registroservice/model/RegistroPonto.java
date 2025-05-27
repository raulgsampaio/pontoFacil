package com.pontofacil.registroservice.model;

import java.time.OffsetDateTime;

public class RegistroPonto {

    private String id;
    private String usuario_id;
    private String tipo;
    private OffsetDateTime data_hora;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsuarioId() {
        return usuario_id;
    }

    public void setUsuarioId(String usuario_id) {
        this.usuario_id = usuario_id;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public OffsetDateTime getDataHora() {
        return data_hora;
    }

    public void setDataHora(OffsetDateTime data_hora) {
        this.data_hora = data_hora;
    }
} 
