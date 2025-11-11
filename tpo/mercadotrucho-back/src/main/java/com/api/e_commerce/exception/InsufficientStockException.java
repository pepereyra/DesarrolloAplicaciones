package com.api.e_commerce.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST)
public class InsufficientStockException extends RuntimeException {
    public InsufficientStockException(String productName, int available, int requested) {
        super(String.format("Stock insuficiente para %s. Disponible: %d, Solicitado: %d", 
              productName, available, requested));
    }
    
    public InsufficientStockException(String message) {
        super(message);
    }
}