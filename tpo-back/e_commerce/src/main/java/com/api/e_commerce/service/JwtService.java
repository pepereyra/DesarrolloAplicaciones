package com.api.e_commerce.service;

import com.api.e_commerce.model.Usuario;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class JwtService {
    
    public String generateToken(Usuario usuario) {
        // En una implementación real, aquí generarías un JWT
        // Por ahora, retornamos un token simulado
        return "token_" + usuario.getId() + "_" + UUID.randomUUID().toString();
    }
    
    public boolean validateToken(String token) {
        // En una implementación real, aquí validarías el JWT
        return token != null && token.startsWith("token_");
    }
    
    public Long getUserIdFromToken(String token) {
        // En una implementación real, extraerías el ID del JWT
        if (token != null && token.startsWith("token_")) {
            String[] parts = token.split("_");
            if (parts.length >= 2) {
                try {
                    return Long.parseLong(parts[1]);
                } catch (NumberFormatException e) {
                    return null;
                }
            }
        }
        return null;
    }
}