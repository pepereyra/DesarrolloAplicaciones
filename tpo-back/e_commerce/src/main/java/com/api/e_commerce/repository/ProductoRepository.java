package com.api.e_commerce.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.api.e_commerce.model.Producto;
import com.api.e_commerce.model.Categoria;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    
    // Búsqueda por título
    List<Producto> findByTitleContainingIgnoreCase(String title);
    Page<Producto> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    
    List<Producto> findByCategoria(Categoria categoria);
    Page<Producto> findByCategoria(Categoria categoria, Pageable pageable);
    
    // Búsqueda por nombre de categoría
    @Query("SELECT p FROM Producto p WHERE p.categoria.name = :categoryName")
    List<Producto> findByCategoriaName(@Param("categoryName") String categoryName);
    
    @Query("SELECT p FROM Producto p WHERE p.categoria.name = :categoryName")
    Page<Producto> findByCategoriaName(@Param("categoryName") String categoryName, Pageable pageable);
    
    // Productos relacionados (misma categoría, excluyendo un producto)
    List<Producto> findByCategoriaAndIdNot(Categoria categoria, Long excludeId);
    
    // Búsqueda por rango de precio
    List<Producto> findByPriceBetween(Integer minPrice, Integer maxPrice);
    Page<Producto> findByPriceBetween(Integer minPrice, Integer maxPrice, Pageable pageable);
    
    @Query("SELECT p FROM Producto p WHERE " +
           "(:search IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:category IS NULL OR p.categoria.name = :category) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice)")
    Page<Producto> findProductosWithFilters(
        @Param("search") String search,
        @Param("category") String category,
        @Param("minPrice") Integer minPrice,
        @Param("maxPrice") Integer maxPrice,
        Pageable pageable
    );
    
    // Productos por vendedor
    List<Producto> findBySellerId(Long sellerId);
    Page<Producto> findBySellerId(Long sellerId, Pageable pageable);
}