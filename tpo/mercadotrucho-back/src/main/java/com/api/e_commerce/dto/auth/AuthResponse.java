package com.api.e_commerce.dto.auth;

import com.api.e_commerce.dto.user.UserDTO;
import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private UserDTO user;
    
    public AuthResponse(String token, UserDTO user) {
        this.token = token;
        this.user = user;
    }
}