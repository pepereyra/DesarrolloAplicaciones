package com.api.e_commerce.dto.auth;

import lombok.Data;

@Data
public class RegisterRequest {
    // Usar nombres en inglés que coincidan con el frontend
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phone;
    
    // Métodos de compatibilidad para el código en español
    public String getNombre() {
        return firstName;
    }
    
    public String getApellido() {
        return lastName;
    }
    
    public String getTelefono() {
        return phone;
    }
}