package com.api.e_commerce.dto.carrito;

import lombok.Data;

@Data
public class CarritoItemDTO {
    private Long id;
    private String productoId;
    private String title;
    private String imageUrl;
    private Integer unitPrice;
    private Integer quantity;
}