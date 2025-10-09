package com.api.e_commerce.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "producto_tag")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoTag {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "producto_id", length = 10)
    private String productoId;
    
    @Column(name = "tag_name", nullable = false, length = 100)
    private String tagName;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id", insertable = false, updatable = false)
    @JsonIgnore  // Evitar serialización circular
    private Producto producto;
}