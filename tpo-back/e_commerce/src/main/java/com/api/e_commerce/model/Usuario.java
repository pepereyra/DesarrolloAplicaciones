package com.api.e_commerce.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "usuario")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {
    
    @Id
    @Column(length = 10)
    private String id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;
    
    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.user;
    
    @Column(length = 500)
    private String avatar;
    
    @Column(name = "seller_nickname", length = 100)
    private String sellerNickname;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "seller_reputation")
    private SellerReputation sellerReputation = SellerReputation.bronze;
    
    @Column(name = "seller_description", columnDefinition = "TEXT")
    private String sellerDescription;
    
    @Column(name = "seller_location", length = 200)
    private String sellerLocation;
    
    @Column(name = "seller_phone", length = 50)
    private String sellerPhone;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Relaciones con LAZY loading para evitar N+1
    @OneToMany(mappedBy = "seller", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore  // Evitar serialización circular
    private List<Producto> productos;
    
    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore  // Evitar serialización circular
    private Carrito carrito;
    
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore  // Evitar serialización circular
    private List<Favorito> favoritos;
    
    public enum Role {
        admin, user
    }
    
    public enum SellerReputation {
        bronze, silver, gold
    }
    
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
