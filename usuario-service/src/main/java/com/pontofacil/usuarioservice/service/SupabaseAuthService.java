package com.pontofacil.usuarioservice.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class SupabaseAuthService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.serviceKey}")
    private String serviceKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String criarUsuarioAuth(String email, String senha) {
        try {
            String url = supabaseUrl + "/auth/v1/admin/users";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("apikey", serviceKey);             // 🔐 obrigatório
            headers.setBearerAuth(serviceKey);             // 🔐 obrigatório

            Map<String, Object> body = new HashMap<>();
            body.put("email", email);
            body.put("password", senha);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, request, Map.class);

            return response.getBody().get("id").toString();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Erro ao criar usuário no Supabase Auth: " + e.getMessage());
        }
    }

    public void deletarUsuarioAuth(String authId) {
        try {
            String url = supabaseUrl + "/auth/v1/admin/users/" + authId;

            HttpHeaders headers = new HttpHeaders();
            headers.set("apikey", serviceKey);
            headers.setBearerAuth(serviceKey);

            HttpEntity<Void> request = new HttpEntity<>(headers);

            restTemplate.exchange(url, HttpMethod.DELETE, request, String.class);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Erro ao deletar usuário no Supabase Auth: " + e.getMessage());
        }
    }

    public void atualizarEmailAuth(String authId, String novoEmail) {
        try {
            String url = supabaseUrl + "/auth/v1/admin/users/" + authId;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("apikey", serviceKey);
            headers.setBearerAuth(serviceKey);

            Map<String, Object> body = Map.of("email", novoEmail);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            restTemplate.exchange(url, HttpMethod.PUT, request, String.class);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Erro ao atualizar e-mail no Supabase Auth: " + e.getMessage());
        }
    }
}
