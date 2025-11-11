package com.api.e_commerce.dto.carrito;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class CarritoDTO {
    private Long id;
    private Long usuarioId;
    private List<CarritoItemDTO> items;
    private Integer totalPrice;
    private Integer totalItems;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}