package com.api.e_commerce.repository;

import com.api.e_commerce.model.Carrito;
import com.api.e_commerce.model.CarritoItem;
import com.api.e_commerce.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CarritoItemRepository extends JpaRepository<CarritoItem, Long> {
    Optional<CarritoItem> findByCarritoIdAndProductoId(Long carritoId, String productoId);
    Optional<CarritoItem> findByCarritoAndProducto(Carrito carrito, Producto producto);
    void deleteByCarrito(Carrito carrito);
}