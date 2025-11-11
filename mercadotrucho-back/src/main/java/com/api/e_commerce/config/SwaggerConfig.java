package com.api.e_commerce.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "bearerAuth";
        
        return new OpenAPI()
                .info(new Info()
                        .title("E-Commerce API - Estilo MercadoLibre")
                        .version("1.0")
                        .description("API REST para aplicación de e-commerce con autenticación JWT. " +
                                   "Para usar endpoints protegidos, primero haz login en /api/auth/login, " +
                                   "copia el token de la respuesta y haz clic en 'Authorize' para configurarlo.")
                        .contact(new Contact()
                                .name("Equipo de Desarrollo")
                                .email("dev@ecommerce.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0.html")))
                // Agregar requisito de seguridad global
                .addSecurityItem(new SecurityRequirement()
                        .addList(securitySchemeName))
                // Definir el esquema de seguridad JWT
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName, new SecurityScheme()
                                .name(securitySchemeName)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Ingrese el token JWT obtenido del endpoint /api/auth/login. " +
                                           "No necesita agregar 'Bearer', solo pegue el token.")
                        ));
    }
}