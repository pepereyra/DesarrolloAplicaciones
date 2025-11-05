package com.api.e_commerce.dto.user;

import com.api.e_commerce.model.Usuario.Role;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private Role role;
    private LocalDateTime createdAt;
    private Boolean active;
}