package com.pontofacil.usuarioservice.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {

    private static final String SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmdHJuaGNvaW5rbWdiZ2VycXNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1OTM1MzgsImV4cCI6MjA2MzE2OTUzOH0.8QSpZ_Mx4HfXpHoDgndNRsJKj7FC3qcy24UyumV4YDg";

    @Bean
    public RestTemplate restTemplate() {
        RestTemplate restTemplate = new RestTemplate();

        ClientHttpRequestInterceptor interceptor = (request, body, execution) -> {
            request.getHeaders().add("apikey", SUPABASE_API_KEY);
            request.getHeaders().add("Authorization", "Bearer " + SUPABASE_API_KEY);
            return execution.execute(request, body);
        };

        restTemplate.setInterceptors(List.of(interceptor));
        return restTemplate;
    }
}
