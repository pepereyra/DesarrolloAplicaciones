package com.api.e_commerce.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "direcciones")
public class Direccion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String calle;
    private String numero;
    private String localidad;
    private String provincia;
    private String pais;
    
}