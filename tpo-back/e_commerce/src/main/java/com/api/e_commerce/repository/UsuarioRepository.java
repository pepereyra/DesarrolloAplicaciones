package com.api.e_commerce.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.api.e_commerce.model.Usuario;

/**
 * Repositorio para manejar operaciones CRUD de la entidad Usuario.
 */
public interface UsuarioRepository extends JpaRepository<Usuario, String> {
    
    Optional<Usuario> findByEmail(String email);
    Boolean existsByEmail(String email);
    List<Usuario> findByFirstNameContaining(String firstName);
    List<Usuario> findByLastNameContaining(String lastName);
    List<Usuario> findByRole(Usuario.Role role);
    List<Usuario> findBySellerNickname(String sellerNickname);
}
