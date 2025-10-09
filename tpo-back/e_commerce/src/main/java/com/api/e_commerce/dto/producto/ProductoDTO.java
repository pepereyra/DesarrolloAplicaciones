package com.api.e_commerce.dto.producto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProductoDTO {
    private String id;
    private String nombre;
    private String descripcion;
    private Integer precio;
    private String categoria;
    private List<String> imagenes;
    private Boolean activo;
    private String vendedorNombre;
    private LocalDateTime fechaCreacion;
    private Boolean esFavorito; // Para indicar si es favorito del usuario actual
}