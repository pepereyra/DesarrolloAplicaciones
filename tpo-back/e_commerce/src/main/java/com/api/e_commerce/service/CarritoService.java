package com.api.e_commerce.service;

import com.api.e_commerce.dto.carrito.CarritoDTO;
import com.api.e_commerce.dto.carrito.CarritoItemDTO;
import com.api.e_commerce.exception.BadRequestException;
import com.api.e_commerce.exception.NotFoundException;
import com.api.e_commerce.model.Carrito;
import com.api.e_commerce.model.CarritoItem;
import com.api.e_commerce.model.Producto;
import com.api.e_commerce.model.Usuario;
import com.api.e_commerce.repository.CarritoItemRepository;
import com.api.e_commerce.repository.CarritoRepository;
import com.api.e_commerce.repository.ProductoRepository;
import com.api.e_commerce.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CarritoService {
    
    private final CarritoRepository carritoRepository;
    private final CarritoItemRepository carritoItemRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    
    public CarritoDTO getCarritoByUsuario(String usuarioId) {
        Carrito carrito = carritoRepository.findByUsuarioId(usuarioId)
            .orElseGet(() -> createCarritoForUser(usuarioId));
        return convertToCarritoDTO(carrito);
    }
    
    private Carrito createCarritoForUser(String usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));
        
        Carrito carrito = new Carrito();
        carrito.setUsuario(usuario);
        carrito.setItems(new ArrayList<>());
        carrito.setCreatedAt(LocalDateTime.now());
        carrito.setUpdatedAt(LocalDateTime.now());
        
        return carritoRepository.save(carrito);
    }
    
    public CarritoDTO addItemToCarrito(String usuarioId, String productoId, Integer cantidad) {
        if (cantidad <= 0) {
            throw new BadRequestException("La cantidad debe ser mayor a 0");
        }
        
        Carrito carrito = carritoRepository.findByUsuarioId(usuarioId)
            .orElseGet(() -> createCarritoForUser(usuarioId));
        
        Producto producto = productoRepository.findById(productoId)
            .orElseThrow(() -> new NotFoundException("Producto no encontrado"));
        
        // Verificar si el item ya existe en el carrito
        CarritoItem existingItem = carritoItemRepository.findByCarritoAndProducto(carrito, producto)
            .orElse(null);
        
        if (existingItem != null) {
            existingItem.setCantidad(existingItem.getCantidad() + cantidad);
        } else {
            CarritoItem newItem = new CarritoItem();
            newItem.setCarrito(carrito);
            newItem.setProducto(producto);
            newItem.setCantidad(cantidad);
            newItem.setPrecioUnitario(producto.getPrice());
            carritoItemRepository.save(newItem);
        }
        
        carrito.setUpdatedAt(LocalDateTime.now());
        carritoRepository.save(carrito);
        
        return convertToCarritoDTO(carrito);
    }
    
    public CarritoDTO updateItemQuantity(String usuarioId, Long itemId, Integer cantidad) {
        if (cantidad <= 0) {
            throw new BadRequestException("La cantidad debe ser mayor a 0");
        }
        
        CarritoItem item = carritoItemRepository.findById(itemId)
            .orElseThrow(() -> new NotFoundException("Item no encontrado"));
        
        if (!item.getCarrito().getUsuario().getId().equals(usuarioId)) {
            throw new BadRequestException("No tienes permiso para modificar este item");
        }
        
        item.setCantidad(cantidad);
        carritoItemRepository.save(item);
        
        item.getCarrito().setUpdatedAt(LocalDateTime.now());
        carritoRepository.save(item.getCarrito());
        
        return convertToCarritoDTO(item.getCarrito());
    }
    
    public CarritoDTO removeItemFromCarrito(String usuarioId, Long itemId) {
        CarritoItem item = carritoItemRepository.findById(itemId)
            .orElseThrow(() -> new NotFoundException("Item no encontrado"));
        
        if (!item.getCarrito().getUsuario().getId().equals(usuarioId)) {
            throw new BadRequestException("No tienes permiso para eliminar este item");
        }
        
        carritoItemRepository.delete(item);
        
        Carrito carrito = item.getCarrito();
        carrito.setUpdatedAt(LocalDateTime.now());
        carritoRepository.save(carrito);
        
        return convertToCarritoDTO(carrito);
    }
    
    public void clearCarrito(String usuarioId) {
        Carrito carrito = carritoRepository.findByUsuarioId(usuarioId)
            .orElseThrow(() -> new NotFoundException("Carrito no encontrado"));
        
        carritoItemRepository.deleteByCarrito(carrito);
        carrito.setUpdatedAt(LocalDateTime.now());
        carritoRepository.save(carrito);
    }
    
    public CarritoDTO convertToCarritoDTO(Carrito carrito) {
        CarritoDTO dto = new CarritoDTO();
        dto.setId(carrito.getId());
        dto.setUsuarioId(carrito.getUsuario().getId());
        dto.setCreatedAt(carrito.getCreatedAt());
        dto.setUpdatedAt(carrito.getUpdatedAt());
        
        List<CarritoItemDTO> itemsDTO = carrito.getItems().stream()
            .map(this::convertToCarritoItemDTO)
            .collect(Collectors.toList());
        dto.setItems(itemsDTO);
        
        // Calcular totales
        int totalItems = itemsDTO.stream().mapToInt(CarritoItemDTO::getQuantity).sum();
        int totalPrice = itemsDTO.stream().mapToInt(item -> item.getUnitPrice() * item.getQuantity()).sum();
        
        dto.setTotalItems(totalItems);
        dto.setTotalPrice(totalPrice);
        
        return dto;
    }
    
    private CarritoItemDTO convertToCarritoItemDTO(CarritoItem item) {
        CarritoItemDTO dto = new CarritoItemDTO();
        dto.setId(item.getId());
        dto.setProductoId(item.getProducto().getId());
        dto.setTitle(item.getProducto().getTitle());
        
        // Obtener primera imagen si existe
        String imageUrl = item.getProducto().getImagenes().stream()
            .findFirst()
            .map(img -> img.getImageUrl())
            .orElse(null);
        dto.setImageUrl(imageUrl);
        
        dto.setQuantity(item.getCantidad());
        dto.setUnitPrice(item.getPrecioUnitario().intValue());
        
        return dto;
    }
}