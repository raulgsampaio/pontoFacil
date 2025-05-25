package com.pontofacil.usuarioservice.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;

@Service
public class SupabaseService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.key}")
    private String supabaseKey;

    private final RestTemplate restTemplate = new RestTemplate();

    private HttpHeaders headers() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("apikey", supabaseKey);
        headers.set("Authorization", "Bearer " + supabaseKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    public String listarUsuarios() {
        String url = supabaseUrl + "/rest/v1/usuarios?select=*";
        HttpEntity<Void> entity = new HttpEntity<>(headers());
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
        return response.getBody();
    }

    public String cadastrarUsuario(JsonNode json) {
        String url = supabaseUrl + "/rest/v1/usuarios";
        HttpEntity<String> entity = new HttpEntity<>(json.toString(), headers());
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
        return response.getBody();
    }

    public String atualizarUsuario(String id, JsonNode json) {
        String url = supabaseUrl + "/rest/v1/usuarios?id=eq." + id;
        HttpHeaders headers = headers();
        headers.set("Prefer", "return=representation");
        HttpEntity<String> entity = new HttpEntity<>(json.toString(), headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.PATCH, entity, String.class);
        return response.getBody();
    }

    public String deletarUsuario(String id) {
        String url = supabaseUrl + "/rest/v1/usuarios?id=eq." + id;
        HttpEntity<Void> entity = new HttpEntity<>(headers());
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.DELETE, entity, String.class);
        return response.getBody();
    }
}
