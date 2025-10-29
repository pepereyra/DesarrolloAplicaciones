package com.api.e_commerce.service;

import com.api.e_commerce.dto.producto.ProductoDTO;
import com.api.e_commerce.exception.NotFoundException;
import com.api.e_commerce.model.Producto;
import com.api.e_commerce.repository.FavoritoRepository;
import com.api.e_commerce.repository.ProductoRepository;
import com.api.e_commerce.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductoService {
    
    private final ProductoRepository productoRepository;
    private final FavoritoRepository favoritoRepository;
    private final UsuarioRepository usuarioRepository;
    
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
    
    public Page<ProductoDTO> getProductosByVendedor(String vendedorId, Pageable pageable) {
        Page<Producto> productos = productoRepository.findBySellerId(vendedorId, pageable);
        return productos.map(producto -> convertToProductoDTO(producto, null));
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
        dto.setTitle(producto.getTitle());
        dto.setDescription(producto.getDescription());
        dto.setPrice(producto.getPrice());
        dto.setCurrency(producto.getCurrency());
        dto.setCondition(producto.getConditionType() != null ? producto.getConditionType().name() : "new");
        dto.setFreeShipping(producto.getFreeShipping());
        dto.setThumbnail(producto.getThumbnail());
        dto.setCategory(producto.getCategory());
        dto.setSellerId(producto.getSellerId());
        dto.setLocation(producto.getLocation());
        dto.setStock(producto.getStock());
        dto.setCreatedAt(producto.getCreatedAt());
        
        // Convertir imágenes a lista de URLs
        if (producto.getImagenes() != null) {
            List<String> imagenes = producto.getImagenes().stream()
                .map(img -> img.getImageUrl())
                .collect(Collectors.toList());
            dto.setImages(imagenes);
        }
        
        // Información del vendedor
        if (producto.getSeller() != null) {
            Map<String, Object> seller = new HashMap<>();
            seller.put("nickname", producto.getSeller().getFirstName() + "_STORE");
            seller.put("reputation", "bronze");
            dto.setSeller(seller);
        }
        
        // Información de cuotas
        if (producto.getInstallmentsQuantity() != null && producto.getInstallmentsAmount() != null) {
            Map<String, Object> installments = new HashMap<>();
            installments.put("quantity", producto.getInstallmentsQuantity());
            installments.put("amount", producto.getInstallmentsAmount());
            dto.setInstallments(installments);
        }
        
        // Verificar si es favorito
        if (usuarioId != null) {
            dto.setEsFavorito(favoritoRepository.existsByUsuarioIdAndProductoId(usuarioId, producto.getId()));
        } else {
            dto.setEsFavorito(false);
        }
        
        return dto;
    }
    
    @Transactional
    public ProductoDTO createProducto(ProductoDTO productoDTO) {
        // Validar que el seller_id existe en la tabla usuario
        if (productoDTO.getSellerId() != null && !productoDTO.getSellerId().isBlank()) {
            if (!usuarioRepository.existsById(productoDTO.getSellerId())) {
                throw new NotFoundException("El vendedor con ID " + productoDTO.getSellerId() + " no existe");
            }
        } else {
            throw new IllegalArgumentException("seller_id es requerido para crear un producto");
        }
        
        Producto producto = convertToProducto(productoDTO);
        // Si no tiene ID, generar uno único (10 caracteres) para la columna id (length=10)
        if (producto.getId() == null || producto.getId().isBlank()) {
            String generated = UUID.randomUUID().toString().replace("-", "");
            // Truncar a 10 caracteres para caber en la columna
            producto.setId(generated.substring(0, Math.min(10, generated.length())));
        }
        Producto savedProducto = productoRepository.save(producto);
        return convertToProductoDTO(savedProducto, null);
    }
    
    @Transactional
    public ProductoDTO updateProducto(String id, ProductoDTO productoDTO) {
        // Buscar el producto existente
        Producto productoExistente = productoRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Producto con ID " + id + " no encontrado"));
        
        // Validar que el seller_id existe si se está actualizando
        if (productoDTO.getSellerId() != null && !productoDTO.getSellerId().isBlank()) {
            if (!usuarioRepository.existsById(productoDTO.getSellerId())) {
                throw new NotFoundException("El vendedor con ID " + productoDTO.getSellerId() + " no existe");
            }
            productoExistente.setSellerId(productoDTO.getSellerId());
        }
        
        // Actualizar campos del producto
        if (productoDTO.getTitle() != null) {
            productoExistente.setTitle(productoDTO.getTitle());
        }
        if (productoDTO.getPrice() != null) {
            productoExistente.setPrice(productoDTO.getPrice());
        }
        if (productoDTO.getDescription() != null) {
            productoExistente.setDescription(productoDTO.getDescription());
        }
        if (productoDTO.getCategory() != null) {
            productoExistente.setCategory(productoDTO.getCategory());
        }
        if (productoDTO.getThumbnail() != null) {
            productoExistente.setThumbnail(productoDTO.getThumbnail());
        }
        if (productoDTO.getLocation() != null) {
            productoExistente.setLocation(productoDTO.getLocation());
        }
        if (productoDTO.getCurrency() != null) {
            productoExistente.setCurrency(productoDTO.getCurrency());
        }
        if (productoDTO.getFreeShipping() != null) {
            productoExistente.setFreeShipping(productoDTO.getFreeShipping());
        }
        if (productoDTO.getStock() != null) {
            productoExistente.setStock(productoDTO.getStock());
        }
        
        // Actualizar condition si se proporciona
        if (productoDTO.getCondition() != null) {
            try {
                productoExistente.setConditionType(Producto.ConditionType.valueOf(productoDTO.getCondition()));
            } catch (IllegalArgumentException e) {
                productoExistente.setConditionType(Producto.ConditionType.new_);
            }
        }
        
        // Actualizar installments si se proporcionan
        if (productoDTO.getInstallments() != null) {
            Object quantity = productoDTO.getInstallments().get("quantity");
            Object amount = productoDTO.getInstallments().get("amount");
            
            if (quantity instanceof Integer) {
                productoExistente.setInstallmentsQuantity((Integer) quantity);
            }
            if (amount instanceof Number) {
                productoExistente.setInstallmentsAmount(java.math.BigDecimal.valueOf(((Number) amount).doubleValue()));
            }
        }
        
        Producto productoActualizado = productoRepository.save(productoExistente);
        return convertToProductoDTO(productoActualizado, null);
    }
    
    @Transactional
    public void deleteProducto(String id) {
        // Verificar que el producto existe
        Producto producto = productoRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Producto con ID " + id + " no encontrado"));
        
        // Eliminar el producto
        productoRepository.delete(producto);
    }
    
    private Producto convertToProducto(ProductoDTO dto) {
        Producto producto = new Producto();
        producto.setTitle(dto.getTitle());
        producto.setPrice(dto.getPrice());
        producto.setDescription(dto.getDescription());
        producto.setCategory(dto.getCategory());
        producto.setThumbnail(dto.getThumbnail());
        producto.setSellerId(dto.getSellerId());
        producto.setLocation(dto.getLocation());
        producto.setCurrency(dto.getCurrency() != null ? dto.getCurrency() : "ARS");
        producto.setFreeShipping(dto.getFreeShipping() != null ? dto.getFreeShipping() : false);
        producto.setStock(dto.getStock() != null ? dto.getStock() : 100);
        
        // Mapear condition string a enum
        if (dto.getCondition() != null) {
            try {
                producto.setConditionType(Producto.ConditionType.valueOf(dto.getCondition()));
            } catch (IllegalArgumentException e) {
                producto.setConditionType(Producto.ConditionType.new_);
            }
        } else {
            producto.setConditionType(Producto.ConditionType.new_);
        }
        
        // Mapear installments
        if (dto.getInstallments() != null) {
            Object quantity = dto.getInstallments().get("quantity");
            Object amount = dto.getInstallments().get("amount");
            
            if (quantity instanceof Integer) {
                producto.setInstallmentsQuantity((Integer) quantity);
            }
            if (amount instanceof Number) {
                producto.setInstallmentsAmount(java.math.BigDecimal.valueOf(((Number) amount).doubleValue()));
            }
        }
        
        return producto;
    }
}
