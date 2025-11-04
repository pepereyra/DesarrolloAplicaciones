package com.api.e_commerce.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "producto")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Producto {
    
    @Id
    @Column(length = 10)
    private String id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal price;
    
    @Column(length = 3)
    private String currency = "ARS";
    
    @Enumerated(EnumType.STRING)
    @Column(name = "condition_type")
    private ConditionType conditionType = ConditionType.new_;
    
    @Column(name = "free_shipping")
    private Boolean freeShipping = false;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = true)
    private Categoria categoria;
    
    @Column(name = "seller_id", length = 10)
    private String sellerId;
    
    @Column(length = 200)
    private String location;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private Integer stock = 0;
    
    @Column(name = "installments_quantity")
    private Integer installmentsQuantity;
    
    @Column(name = "installments_amount", precision = 15, scale = 2)
    private BigDecimal installmentsAmount;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Relaciones
    @ManyToOne
    @JoinColumn(name = "seller_id", insertable = false, updatable = false)
    private Usuario seller;
    
    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore  // Evitar serialización circular
    private List<ProductoImagen> imagenes;
    
    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore  // Evitar serialización circular
    private List<ProductoTag> tags;
    
    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore  // Evitar serialización circular
    private List<Favorito> favoritos;
    
    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore  // Evitar serialización circular
    private List<CarritoItem> carritoItems;
    
    public enum ConditionType {
        new_, used
    }
    
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
