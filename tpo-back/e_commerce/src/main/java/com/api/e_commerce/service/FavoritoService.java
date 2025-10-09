package com.api.e_commerce.service;

import com.api.e_commerce.dto.producto.ProductoDTO;
import com.api.e_commerce.exception.BadRequestException;
import com.api.e_commerce.exception.NotFoundException;
import com.api.e_commerce.model.Favorito;
import com.api.e_commerce.model.Producto;
import com.api.e_commerce.model.Usuario;
import com.api.e_commerce.repository.FavoritoRepository;
import com.api.e_commerce.repository.ProductoRepository;
import com.api.e_commerce.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class FavoritoService {
    
    private final FavoritoRepository favoritoRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoService productoService;
    
    public Page<ProductoDTO> getFavoritosByUsuarioId(String usuarioId, Pageable pageable) {
        Page<Favorito> favoritos = favoritoRepository.findByUsuarioIdOrderByCreatedAtDesc(usuarioId, pageable);
        return favoritos.map(favorito -> productoService.convertToProductoDTO(favorito.getProducto()));
    }
    
    public void addToFavoritos(String usuarioId, String productoId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));
        
        Producto producto = productoRepository.findById(productoId)
            .orElseThrow(() -> new NotFoundException("Producto no encontrado"));
        
        // Verificar si ya está en favoritos
        if (favoritoRepository.existsByUsuarioAndProducto(usuario, producto)) {
            throw new BadRequestException("El producto ya está en favoritos");
        }
        
        Favorito favorito = new Favorito();
        favorito.setUsuario(usuario);
        favorito.setProducto(producto);
        
        favoritoRepository.save(favorito);
    }
    
    public void removeFromFavoritos(String usuarioId, String productoId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));
        
        Producto producto = productoRepository.findById(productoId)
            .orElseThrow(() -> new NotFoundException("Producto no encontrado"));
        
        Favorito favorito = favoritoRepository.findByUsuarioAndProducto(usuario, producto)
            .orElseThrow(() -> new NotFoundException("El producto no está en favoritos"));
        
        favoritoRepository.delete(favorito);
    }
    
    public boolean isProductoInFavoritos(String usuarioId, String productoId) {
        return favoritoRepository.existsByUsuarioIdAndProductoId(usuarioId, productoId);
    }
    
    public Long countFavoritosByUsuarioId(String usuarioId) {
        return favoritoRepository.countByUsuarioId(usuarioId);
    }
}