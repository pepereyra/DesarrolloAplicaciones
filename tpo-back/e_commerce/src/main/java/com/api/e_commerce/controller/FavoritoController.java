package com.api.e_commerce.controller;

import com.api.e_commerce.dto.producto.ProductoDTO;
import com.api.e_commerce.service.FavoritoService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/favoritos")
@RequiredArgsConstructor
public class FavoritoController {
    
    private final FavoritoService favoritoService;
    
    @GetMapping("/{usuarioId}")
    public ResponseEntity<Page<ProductoDTO>> getFavoritos(
            @PathVariable String usuarioId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductoDTO> favoritos = favoritoService.getFavoritosByUsuarioId(usuarioId, pageable);
        return ResponseEntity.ok(favoritos);
    }
    
    @PostMapping("/{usuarioId}")
    public ResponseEntity<Void> addToFavoritos(
            @PathVariable String usuarioId,
            @RequestParam String productoId) {
        
        favoritoService.addToFavoritos(usuarioId, productoId);
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/{usuarioId}")
    public ResponseEntity<Void> removeFromFavoritos(
            @PathVariable String usuarioId,
            @RequestParam String productoId) {
        
        favoritoService.removeFromFavoritos(usuarioId, productoId);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/{usuarioId}/check")
    public ResponseEntity<Boolean> isProductoInFavoritos(
            @PathVariable String usuarioId,
            @RequestParam String productoId) {
        
        boolean isFavorito = favoritoService.isProductoInFavoritos(usuarioId, productoId);
        return ResponseEntity.ok(isFavorito);
    }
    
    @GetMapping("/{usuarioId}/count")
    public ResponseEntity<Long> countFavoritos(@PathVariable String usuarioId) {
        Long count = favoritoService.countFavoritosByUsuarioId(usuarioId);
        return ResponseEntity.ok(count);
    }
}