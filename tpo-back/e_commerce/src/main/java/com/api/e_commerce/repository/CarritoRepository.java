package com.api.e_commerce.repository;

import com.api.e_commerce.model.Carrito;
import com.api.e_commerce.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CarritoRepository extends JpaRepository<Carrito, Long> {
    Optional<Carrito> findByUsuario(Usuario usuario);
    Optional<Carrito> findByUsuarioId(String usuarioId);
}