package com.api.e_commerce.repository;

import com.api.e_commerce.model.Favorito;
import com.api.e_commerce.model.Producto;
import com.api.e_commerce.model.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoritoRepository extends JpaRepository<Favorito, Long> {
    List<Favorito> findByUsuarioId(String usuarioId);
    Page<Favorito> findByUsuarioIdOrderByCreatedAtDesc(String usuarioId, Pageable pageable);
    Optional<Favorito> findByUsuarioIdAndProductoId(String usuarioId, String productoId);
    Optional<Favorito> findByUsuarioAndProducto(Usuario usuario, Producto producto);
    boolean existsByUsuarioIdAndProductoId(String usuarioId, String productoId);
    boolean existsByUsuarioAndProducto(Usuario usuario, Producto producto);
    Long countByUsuarioId(String usuarioId);
    void deleteByUsuarioIdAndProductoId(String usuarioId, String productoId);
}