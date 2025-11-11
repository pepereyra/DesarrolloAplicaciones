package com.api.e_commerce.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_FOUND)
public class CarritoNotFoundException extends RuntimeException {
    public CarritoNotFoundException(Long usuarioId) {
        super("Carrito para usuario con ID " + usuarioId + " no encontrado");
    }
}