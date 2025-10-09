package com.api.e_commerce.service;

import com.api.e_commerce.dto.producto.ProductoDTO;
import com.api.e_commerce.exception.NotFoundException;
import com.api.e_commerce.model.Producto;
import com.api.e_commerce.repository.FavoritoRepository;
import com.api.e_commerce.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductoService {
    
    private final ProductoRepository productoRepository;
    private final FavoritoRepository favoritoRepository;
    
    public Page<ProductoDTO> getAllProductos(Pageable pageable) {
        Page<Producto> productos = productoRepository.findAll(pageable);
        return productos.map(producto -> convertToProductoDTO(producto, null));
    }
    
    public Page<ProductoDTO> getAllProductos(String usuarioId, Pageable pageable) {
        Page<Producto> productos = productoRepository.findAll(pageable);
        return productos.map(producto -> convertToProductoDTO(producto, usuarioId));
    }
    
    public Page<ProductoDTO> searchProductos(String query, Pageable pageable) {
        Page<Producto> productos = productoRepository.findByTitleContainingIgnoreCase(query, pageable);
        return productos.map(producto -> convertToProductoDTO(producto, null));
    }
    
    public Page<ProductoDTO> searchProductos(String query, String usuarioId, Pageable pageable) {
        Page<Producto> productos = productoRepository.findByTitleContainingIgnoreCase(query, pageable);
        return productos.map(producto -> convertToProductoDTO(producto, usuarioId));
    }
    
    public Page<ProductoDTO> getProductosByCategoria(String categoria, Pageable pageable) {
        Page<Producto> productos = productoRepository.findByCategory(categoria, pageable);
        return productos.map(producto -> convertToProductoDTO(producto, null));
    }
    
    public Page<ProductoDTO> getProductosByCategoria(String categoria, String usuarioId, Pageable pageable) {
        Page<Producto> productos = productoRepository.findByCategory(categoria, pageable);
        return productos.map(producto -> convertToProductoDTO(producto, usuarioId));
    }
    
    public ProductoDTO getProductoById(String id) {
        Producto producto = productoRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Producto no encontrado"));
        return convertToProductoDTO(producto, null);
    }
    
    public ProductoDTO getProductoById(String id, String usuarioId) {
        Producto producto = productoRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Producto no encontrado"));
        return convertToProductoDTO(producto, usuarioId);
    }
    
    public List<ProductoDTO> getProductosRelacionados(String productoId, int limit) {
        Producto producto = productoRepository.findById(productoId)
            .orElseThrow(() -> new NotFoundException("Producto no encontrado"));
        
        // Buscar productos de la misma categoría (limitado)
        List<Producto> relacionados = productoRepository.findByCategoryAndIdNot(producto.getCategory(), productoId);
        
        return relacionados.stream()
            .limit(limit)
            .map(p -> convertToProductoDTO(p, null))
            .collect(Collectors.toList());
    }
    
    public ProductoDTO convertToProductoDTO(Producto producto) {
        return convertToProductoDTO(producto, null);
    }
    
    public ProductoDTO convertToProductoDTO(Producto producto, String usuarioId) {
        ProductoDTO dto = new ProductoDTO();
        dto.setId(producto.getId());
        dto.setNombre(producto.getTitle());
        dto.setDescripcion(producto.getTitle()); // En el db.json no hay descripción separada
        dto.setPrecio(producto.getPrice().intValue());
        dto.setActivo(true); // Asumimos que todos están activos
        dto.setFechaCreacion(producto.getCreatedAt());
        
        // Obtener categoría
        dto.setCategoria(producto.getCategory());
        
        // Convertir imágenes a lista de URLs
        List<String> imagenes = producto.getImagenes().stream()
            .map(img -> img.getImageUrl())
            .collect(Collectors.toList());
        dto.setImagenes(imagenes);
        
        // Nombre del vendedor
        if (producto.getSeller() != null) {
            dto.setVendedorNombre(producto.getSeller().getFirstName() + " " + producto.getSeller().getLastName());
        }
        
        // Verificar si es favorito
        if (usuarioId != null) {
            dto.setEsFavorito(favoritoRepository.existsByUsuarioIdAndProductoId(usuarioId, producto.getId()));
        } else {
            dto.setEsFavorito(false);
        }
        
        return dto;
    }
}
