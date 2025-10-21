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
                        .allowedOrigins(
                            "http://localhost:3000",    // React dev server
                            "http://localhost:5173",    // Vite dev server
                            "http://localhost:4173",    // Vite preview
                            "http://127.0.0.1:5173",   // Vite alternativo
                            "http://127.0.0.1:3000"    // React alternativo
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