package com.pontofacil.usuarioservice.model;

import java.time.OffsetDateTime;

public class Usuario {

    private String id;
    private String authId;
    private String nome;
    private String email;
    private String tipoUsuario;
    private OffsetDateTime criadoEm;

    public Usuario() {
    }

    public Usuario(String id, String authId, String nome, String email, String tipoUsuario, OffsetDateTime criadoEm) {
        this.id = id;
        this.authId = authId;
        this.nome = nome;
        this.email = email;
        this.tipoUsuario = tipoUsuario;
        this.criadoEm = criadoEm;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAuthId() {
        return authId;
    }

    public void setAuthId(String authId) {
        this.authId = authId;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTipoUsuario() {
        return tipoUsuario;
    }

    public void setTipoUsuario(String tipoUsuario) {
        this.tipoUsuario = tipoUsuario;
    }

    public OffsetDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(OffsetDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }
}
