package com.pontofacil.registroservice.service;

import java.time.OffsetDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pontofacil.registroservice.model.RegistroPonto;

@Service
public class SupabaseService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.serviceKey}")
    private String supabaseKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private HttpHeaders headers() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("apikey", supabaseKey);
        headers.set("Authorization", "Bearer " + supabaseKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    public void salvarRegistro(RegistroPonto registro) {
        String url = supabaseUrl + "/rest/v1/registros_ponto";

        registro.setId(UUID.randomUUID().toString());

        HttpHeaders headers = headers();
        headers.set("Prefer", "return=representation");

        HttpEntity<RegistroPonto> request = new HttpEntity<>(registro, headers);
        restTemplate.exchange(url, HttpMethod.POST, request, String.class);
    }

    public RegistroPonto buscarUltimoRegistro(String usuarioId) {
        try {
            String url = supabaseUrl + "/rest/v1/registros_ponto"
                    + "?usuario_id=eq." + usuarioId
                    + "&order=data_hora.desc&limit=1";

            HttpEntity<Void> request = new HttpEntity<>(headers());
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, request, String.class);

            JsonNode array = objectMapper.readTree(response.getBody());
            if (array.isArray() && array.size() > 0) {
                JsonNode obj = array.get(0);
                RegistroPonto registro = new RegistroPonto();
                registro.setId(obj.get("id").asText());
                registro.setUsuarioId(obj.get("usuario_id").asText());
                registro.setTipo(obj.get("tipo").asText());
                registro.setDataHora(OffsetDateTime.parse(obj.get("data_hora").asText()));
                return registro;
            }

            return null;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Erro ao buscar último registro");
        }
    }

    public String buscarIdPorAuthId(String authId) {
    try {
        String url = supabaseUrl + "/rest/v1/usuarios?auth_id=eq." + authId + "&select=id";
        HttpEntity<Void> request = new HttpEntity<>(headers());
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, request, String.class);
        JsonNode array = objectMapper.readTree(response.getBody());

        if (array.isArray() && array.size() > 0) {
            return array.get(0).get("id").asText();
        }

        throw new RuntimeException("Usuário não encontrado para auth_id: " + authId);
    } catch (Exception e) {
        e.printStackTrace();
        throw new RuntimeException("Erro ao buscar ID do usuário: " + e.getMessage());
    }
}

}
