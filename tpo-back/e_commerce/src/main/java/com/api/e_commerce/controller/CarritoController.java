package com.api.e_commerce.controller;

import com.api.e_commerce.dto.carrito.CarritoDTO;
import com.api.e_commerce.service.CarritoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carrito")
@RequiredArgsConstructor
public class CarritoController {
    
    private final CarritoService carritoService;
    
    @GetMapping("/{usuarioId}")
    public ResponseEntity<CarritoDTO> getCarrito(@PathVariable Long usuarioId) {
        CarritoDTO carrito = carritoService.getCarritoByUsuario(usuarioId);
        return ResponseEntity.ok(carrito);
    }
    
    @PostMapping("/{usuarioId}/items")
    public ResponseEntity<CarritoDTO> addItemToCarrito(
            @PathVariable Long usuarioId,
            @RequestParam Long productoId,
            @RequestParam Integer cantidad) {
        
        CarritoDTO carrito = carritoService.addItemToCarrito(usuarioId, productoId, cantidad);
        return ResponseEntity.ok(carrito);
    }
    
    @PutMapping("/{usuarioId}/items/{itemId}")
    public ResponseEntity<CarritoDTO> updateItemQuantity(
            @PathVariable Long usuarioId,
            @PathVariable Long itemId,
            @RequestParam Integer cantidad) {
        
        CarritoDTO carrito = carritoService.updateItemQuantity(usuarioId, itemId, cantidad);
        return ResponseEntity.ok(carrito);
    }
    
    @DeleteMapping("/{usuarioId}/items/{itemId}")
    public ResponseEntity<CarritoDTO> removeItemFromCarrito(
            @PathVariable Long usuarioId,
            @PathVariable Long itemId) {
        
        CarritoDTO carrito = carritoService.removeItemFromCarrito(usuarioId, itemId);
        return ResponseEntity.ok(carrito);
    }
    
    @DeleteMapping("/{usuarioId}")
    public ResponseEntity<Void> clearCarrito(@PathVariable Long usuarioId) {
        carritoService.clearCarrito(usuarioId);
        return ResponseEntity.ok().build();
    }
}