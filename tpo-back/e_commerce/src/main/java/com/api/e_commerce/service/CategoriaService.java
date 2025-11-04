package com.api.e_commerce.service;

import com.api.e_commerce.dto.CategoriaDTO;
import com.api.e_commerce.exception.NotFoundException;
import com.api.e_commerce.model.Categoria;
import com.api.e_commerce.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoriaService {
    
    private final CategoriaRepository categoriaRepository;
    
    public List<CategoriaDTO> getAllCategorias() {
        return categoriaRepository.findAllOrderedByName()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public CategoriaDTO getCategoriaById(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Categoría no encontrada"));
        return convertToDTO(categoria);
    }
    
    public Categoria getCategoriaEntityByName(String name) {
        return categoriaRepository.findByName(name)
                .orElseThrow(() -> new NotFoundException("Categoría no encontrada: " + name));
    }
    
    public Categoria getCategoriaEntityById(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Categoría no encontrada"));
    }
    
    private CategoriaDTO convertToDTO(Categoria categoria) {
        return new CategoriaDTO(
                categoria.getId(),
                categoria.getName(),
                categoria.getDescription(),
                categoria.getImage()
        );
    }
}