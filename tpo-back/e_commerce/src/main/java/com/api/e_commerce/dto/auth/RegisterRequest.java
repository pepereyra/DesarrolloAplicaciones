package com.api.e_commerce.dto.auth;

import lombok.Data;

@Data
public class RegisterRequest {
    private String nombre;
    private String apellido;
    private String email;
    private String password;
    private String telefono;
}