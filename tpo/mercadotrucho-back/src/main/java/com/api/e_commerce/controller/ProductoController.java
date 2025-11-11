package com.api.e_commerce.controller;

import com.api.e_commerce.dto.producto.ProductoDTO;
import com.api.e_commerce.service.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {
    
    private final ProductoService productoService;
    
    @GetMapping
    public ResponseEntity<Page<ProductoDTO>> getAllProductos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Long usuarioId) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductoDTO> productos = usuarioId != null ?
            productoService.getAllProductos(usuarioId, pageable) :
            productoService.getAllProductos(pageable);
        
        return ResponseEntity.ok(productos);
    }
    
    @GetMapping("/search")
    public ResponseEntity<Page<ProductoDTO>> searchProductos(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Long usuarioId) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductoDTO> productos = usuarioId != null ?
            productoService.searchProductos(q, usuarioId, pageable) :
            productoService.searchProductos(q, pageable);
        
        return ResponseEntity.ok(productos);
    }
    
    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<Page<ProductoDTO>> getProductosByCategoria(
            @PathVariable String categoria,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Long usuarioId) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductoDTO> productos = usuarioId != null ?
            productoService.getProductosByCategoria(categoria, usuarioId, pageable) :
            productoService.getProductosByCategoria(categoria, pageable);
        
        return ResponseEntity.ok(productos);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ProductoDTO> getProductoById(
            @PathVariable Long id,
            @RequestParam(required = false) Long usuarioId) {
        
        ProductoDTO producto = usuarioId != null ?
            productoService.getProductoById(id, usuarioId) :
            productoService.getProductoById(id);
        
        return ResponseEntity.ok(producto);
    }
    
    @GetMapping("/{id}/relacionados")
    public ResponseEntity<List<ProductoDTO>> getProductosRelacionados(
            @PathVariable Long id,
            @RequestParam(defaultValue = "4") int limit) {
        
        List<ProductoDTO> productos = productoService.getProductosRelacionados(id, limit);
        return ResponseEntity.ok(productos);
    }
    
    @PostMapping
    public ResponseEntity<ProductoDTO> createProducto(@RequestBody ProductoDTO productoDTO) {
        ProductoDTO nuevoProducto = productoService.createProducto(productoDTO);
        return ResponseEntity.ok(nuevoProducto);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ProductoDTO> updateProducto(
            @PathVariable Long id,
            @RequestBody ProductoDTO productoDTO) {
        ProductoDTO productoActualizado = productoService.updateProducto(id, productoDTO);
        return ResponseEntity.ok(productoActualizado);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProducto(@PathVariable Long id) {
        productoService.deleteProducto(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/vendedor/{vendedorId}")
    public ResponseEntity<Page<ProductoDTO>> getProductosByVendedor(
            @PathVariable Long vendedorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductoDTO> productos = productoService.getProductosByVendedor(vendedorId, pageable);
        return ResponseEntity.ok(productos);
    }
}
