package com.api.e_commerce.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {
    
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOriginPatterns(
                            "http://localhost:*",      // Cualquier puerto localhost
                            "http://127.0.0.1:*",     // Cualquier puerto 127.0.0.1
                            "https://localhost:*",     // HTTPS localhost
                            "https://127.0.0.1:*"     // HTTPS 127.0.0.1
                        )
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                        .allowedHeaders(
                            "Origin",
                            "Content-Type", 
                            "Accept",
                            "Authorization",
                            "X-Requested-With",
                            "Access-Control-Request-Method",
                            "Access-Control-Request-Headers"
                        )
                        .exposedHeaders(
                            "Access-Control-Allow-Origin",
                            "Access-Control-Allow-Credentials"
                        )
                        .allowCredentials(true)
                        .maxAge(3600); // Cache preflight por 1 hora
            }
        };
    }
}