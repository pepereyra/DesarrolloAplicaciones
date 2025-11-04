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
                            "http://localhost:3000",      // React dev server
                            "http://localhost:5173",      // Vite dev server
                            "http://localhost:8080",      // Swagger UI
                            "http://127.0.0.1:3000",
                            "http://127.0.0.1:5173",
                            "http://127.0.0.1:8080"
                        )
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                        .allowedHeaders(
                            "Content-Type",
                            "Authorization", 
                            "X-Requested-With",
                            "Accept",
                            "Origin",
                            "Cache-Control"
                        )
                        .allowCredentials(true)
                        .maxAge(3600); // Cache preflight por 1 hora
            }
        };
    }
}