package com.api.e_commerce.service;

import com.api.e_commerce.dto.auth.AuthResponse;
import com.api.e_commerce.dto.auth.LoginRequest;
import com.api.e_commerce.dto.auth.RegisterRequest;
import com.api.e_commerce.dto.user.UserDTO;
import com.api.e_commerce.exception.BadRequestException;
import com.api.e_commerce.exception.UnauthorizedException;
import com.api.e_commerce.model.Carrito;
import com.api.e_commerce.model.Usuario;
import com.api.e_commerce.repository.CarritoRepository;
import com.api.e_commerce.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {
    
    private final UsuarioRepository usuarioRepository;
    private final CarritoRepository carritoRepository;
    private final JwtService jwtService;
    
    public AuthResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new UnauthorizedException("Credenciales inválidas"));
        
        // Aquí normalmente verificarías la contraseña encriptada
        if (!request.getPassword().equals(usuario.getPassword())) {
            throw new UnauthorizedException("Credenciales inválidas");
        }
        
        String token = jwtService.generateToken(usuario);
        UserDTO userDTO = convertToUserDTO(usuario);
        
        return new AuthResponse(token, userDTO);
    }
    
    public AuthResponse register(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("El email ya está registrado");
        }
        
        Usuario usuario = new Usuario();
        usuario.setEmail(request.getEmail());
        usuario.setPassword(request.getPassword()); // En producción esto debe estar encriptado
        usuario.setFirstName(request.getNombre());
        usuario.setLastName(request.getApellido());
        usuario.setRole(Usuario.Role.user);
        usuario.setCreatedAt(LocalDateTime.now());
        
        Usuario savedUsuario = usuarioRepository.save(usuario);
        
        // Crear carrito vacío para el usuario
        Carrito carrito = new Carrito();
        carrito.setUsuario(savedUsuario);
        carrito.setItems(new ArrayList<>());
        carrito.setCreatedAt(LocalDateTime.now());
        carrito.setUpdatedAt(LocalDateTime.now());
        carritoRepository.save(carrito);
        
        String token = jwtService.generateToken(savedUsuario);
        UserDTO userDTO = convertToUserDTO(savedUsuario);
        
        return new AuthResponse(token, userDTO);
    }
    
    private UserDTO convertToUserDTO(Usuario usuario) {
        UserDTO dto = new UserDTO();
        dto.setId(usuario.getId());
        dto.setFirstName(usuario.getFirstName());
        dto.setLastName(usuario.getLastName());
        dto.setEmail(usuario.getEmail());
        dto.setRole(usuario.getRole());
        dto.setCreatedAt(usuario.getCreatedAt());
        dto.setActive(true); // Por defecto siempre activo en esta implementación
        
        return dto;
    }
}