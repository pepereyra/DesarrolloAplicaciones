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
    List<Favorito> findByUsuarioId(Long usuarioId);
    Page<Favorito> findByUsuarioIdOrderByCreatedAtDesc(Long usuarioId, Pageable pageable);
    Optional<Favorito> findByUsuarioIdAndProductoId(Long usuarioId, Long productoId);
    Optional<Favorito> findByUsuarioAndProducto(Usuario usuario, Producto producto);
    boolean existsByUsuarioIdAndProductoId(Long usuarioId, Long productoId);
    boolean existsByUsuarioAndProducto(Usuario usuario, Producto producto);
    Long countByUsuarioId(Long usuarioId);
    void deleteByUsuarioIdAndProductoId(Long usuarioId, Long productoId);
}