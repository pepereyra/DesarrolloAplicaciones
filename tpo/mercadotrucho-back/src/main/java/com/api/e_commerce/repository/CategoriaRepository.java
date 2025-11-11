package com.api.e_commerce.repository;

import com.api.e_commerce.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    
    Optional<Categoria> findByName(String name);
    
    @Query("SELECT c FROM Categoria c ORDER BY c.name ASC")
    List<Categoria> findAllOrderedByName();
    
    boolean existsByName(String name);
}