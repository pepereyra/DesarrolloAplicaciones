package com.api.e_commerce.dto.producto;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.api.e_commerce.dto.CategoriaDTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
public class ProductoDTO {
    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private String currency;
    private String condition;
    @JsonProperty("free_shipping")
    private Boolean freeShipping;
    private String thumbnail;
    private CategoriaDTO categoria;
    private String category;
    private Long sellerId;
    private String location;
    private Integer stock;
    private List<String> images;
    private List<String> tags;
    private Map<String, Object> seller;
    private Map<String, Object> installments;
    private LocalDateTime createdAt;
    private Boolean esFavorito;
}