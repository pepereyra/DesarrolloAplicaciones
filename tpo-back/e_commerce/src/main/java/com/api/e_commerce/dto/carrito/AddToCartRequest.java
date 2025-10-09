package com.api.e_commerce.dto.carrito;

import lombok.Data;

@Data
public class AddToCartRequest {
    private Long productoId;
    private Integer cantidad;
}