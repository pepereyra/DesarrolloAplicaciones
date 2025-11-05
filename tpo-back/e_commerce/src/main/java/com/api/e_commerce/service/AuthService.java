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
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {
    
    private final UsuarioRepository usuarioRepository;
    private final CarritoRepository carritoRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    
    public AuthResponse login(LoginRequest request) {
        // Autenticar con Spring Security
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new UnauthorizedException("Credenciales inválidas"));
        
        // Generar token JWT con información adicional del usuario
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("userId", usuario.getId());
        extraClaims.put("role", usuario.getRole().name());
        
        var userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(usuario.getEmail())
                .password(usuario.getPassword())
                .roles(usuario.getRole().name())
                .build();
        
        String token = jwtService.generateToken(extraClaims, userDetails);
        UserDTO userDTO = convertToUserDTO(usuario);
        
        return new AuthResponse(token, userDTO);
    }
    
    public AuthResponse register(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("El email ya está registrado");
        }
        
        Usuario usuario = new Usuario();
        // No longer need to generate ID - database auto-increment will handle it
        
        usuario.setEmail(request.getEmail().toLowerCase().trim()); // Normalizar email
        // Encriptar la contraseña con BCrypt
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        
        // Manejar nombres con null-safety
        String firstName = request.getNombre() != null ? request.getNombre() : "Usuario";
        String lastName = request.getApellido() != null ? request.getApellido() : "";
        
        usuario.setFirstName(firstName);
        usuario.setLastName(lastName);
        usuario.setRole(Usuario.Role.user);
        usuario.setCreatedAt(LocalDateTime.now());
        
        // Inicializar valores por defecto para seller
        usuario.setSellerNickname(firstName.toUpperCase() + "_STORE");
        usuario.setSellerReputation(Usuario.SellerReputation.bronze);
        usuario.setSellerDescription("Tienda de " + firstName);
        usuario.setSellerLocation("Argentina");
        usuario.setSellerPhone(request.getTelefono() != null ? request.getTelefono() : "");
        
        Usuario savedUsuario = usuarioRepository.save(usuario);
        
        // Crear carrito vacío para el usuario
        Carrito carrito = new Carrito();
        carrito.setUsuario(savedUsuario);
        carrito.setItems(new ArrayList<>());
        carrito.setCreatedAt(LocalDateTime.now());
        carrito.setUpdatedAt(LocalDateTime.now());
        carritoRepository.save(carrito);
        
        // Generar token JWT
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("userId", savedUsuario.getId());
        extraClaims.put("role", savedUsuario.getRole().name());
        
        var userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(savedUsuario.getEmail())
                .password(savedUsuario.getPassword())
                .roles(savedUsuario.getRole().name())
                .build();
        
        String token = jwtService.generateToken(extraClaims, userDetails);
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
        dto.setActive(true);
        
        return dto;
    }
}