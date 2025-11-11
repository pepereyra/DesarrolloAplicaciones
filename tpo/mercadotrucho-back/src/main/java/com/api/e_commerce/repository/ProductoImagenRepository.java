package com.api.e_commerce.repository;

import com.api.e_commerce.model.ProductoImagen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoImagenRepository extends JpaRepository<ProductoImagen, Long> {
    
    List<ProductoImagen> findByProductoIdOrderByOrden(Long productoId);
    
    void deleteByProductoId(Long productoId);
    
    @Query("SELECT pi FROM ProductoImagen pi WHERE pi.productoId = :productoId ORDER BY pi.orden ASC")
    List<ProductoImagen> findImagenesByProductoId(@Param("productoId") Long productoId);
}