package com.api.e_commerce.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.api.e_commerce.model.Producto;

public interface ProductoRepository extends JpaRepository<Producto, String> {
    
    // Búsqueda por título
    List<Producto> findByTitleContainingIgnoreCase(String title);
    Page<Producto> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    
    // Búsqueda por categoría
    List<Producto> findByCategory(String category);
    Page<Producto> findByCategory(String category, Pageable pageable);
    
    // Productos relacionados (misma categoría, excluyendo un producto)
    List<Producto> findByCategoryAndIdNot(String category, String excludeId);
    
    // Búsqueda por rango de precio
    List<Producto> findByPriceBetween(Integer minPrice, Integer maxPrice);
    Page<Producto> findByPriceBetween(Integer minPrice, Integer maxPrice, Pageable pageable);
    
    // Búsqueda combinada
    @Query("SELECT p FROM Producto p WHERE " +
           "(:search IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:category IS NULL OR p.category = :category) AND " +
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
    List<Producto> findBySellerId(String sellerId);
    Page<Producto> findBySellerId(String sellerId, Pageable pageable);
}