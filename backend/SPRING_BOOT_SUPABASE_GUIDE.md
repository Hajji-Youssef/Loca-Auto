# Guide Backend : Spring Boot + Supabase (PostgreSQL)

Voici l'architecture complète **Controller - Service - Repository** pour votre application LocaAuto.

## 1. Préparation Supabase

1. Créez un projet sur [Supabase.com](https://supabase.com).
2. Allez dans **Project Settings** -> **Database**.
3. Récupérez les infos de connexion (Host, Port, User, Password, Database Name).

## 2. Configuration (`src/main/resources/application.properties`)

Remplacez les valeurs en majuscules par vos infos Supabase.
**Note :** Ajoutez `?sslmode=require` à la fin de l'URL pour Supabase.

```properties
# Connexion Base de données (Supabase)
spring.datasource.url=jdbc:postgresql://AWS-0-EU-CENTRAL-1.POOLER.SUPABASE.COM:5432/postgres?sslmode=require
spring.datasource.username=postgres.votre_user_projet
spring.datasource.password=VOTRE_MOT_DE_PASSE_DB
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA / Hibernate
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
# 'update' va créer les tables automatiquement au démarrage
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true

# Configuration CORS (Pour autoriser le Frontend React)
app.cors.allowed-origins=http://localhost:3000
```

## 3. Dépendances (`pom.xml`)

```xml
<dependencies>
    <!-- Web & Data -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- PostgreSQL Driver -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <scope>runtime</scope>
    </dependency>

    <!-- Lombok (Pour éviter les getters/setters manuels) -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
</dependencies>
```

---

## 4. Code Java (Architecture)

Créez les packages suivants :
- `com.locaauto.api.model` (Entités)
- `com.locaauto.api.repository` (Accès BDD)
- `com.locaauto.api.service` (Logique Métier)
- `com.locaauto.api.controller` (Endpoints REST)
- `com.locaauto.api.dto` (Objets de transfert)

### A. Modèles (Entities)

**`model/Product.java`**
```java
package com.locaauto.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    
    @Column(length = 2000)
    private String description;
    
    private Double pricePerDay;
    private String category;
    private String imageUrl;
    private Boolean available;
    private String transmission;
    private String fuelType;
    private Integer seats;

    @ElementCollection
    @CollectionTable(name = "product_options", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "option_name")
    private List<String> options;
}
```

**`model/Rental.java`**
```java
package com.locaauto.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
@Table(name = "rentals")
public class Rental {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private LocalDate startDate;
    private LocalDate endDate;
    private Double totalPrice;
    
    // Status: ACTIVE, PENDING, COMPLETED, CANCELLED
    private String status; 
}
```

### B. DTOs

**`dto/DayAvailability.java`**
```java
package com.locaauto.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class DayAvailability {
    private LocalDate date;
    private boolean isReserved;
    private Double price;
}
```

**`dto/RentalRequest.java`**
```java
package com.locaauto.api.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class RentalRequest {
    private Long productId;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double totalPrice;
}
```

### C. Repositories

**`repository/ProductRepository.java`**
```java
package com.locaauto.api.repository;

import com.locaauto.api.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // Logique complexe : Trouver les produits qui n'ont AUCUNE réservation chevauchant les dates données
    @Query("SELECT p.id FROM Product p WHERE p.id NOT IN (" +
           "SELECT r.product.id FROM Rental r WHERE " +
           "(r.startDate <= :endDate AND r.endDate >= :startDate) AND r.status != 'CANCELLED')")
    List<Long> findAvailableProductIds(@Param("startDate") LocalDate startDate, 
                                       @Param("endDate") LocalDate endDate);
}
```

**`repository/RentalRepository.java`**
```java
package com.locaauto.api.repository;

import com.locaauto.api.model.Rental;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface RentalRepository extends JpaRepository<Rental, Long> {

    // Vérifie s'il existe une réservation conflictuelle (chevauchement)
    @Query("SELECT COUNT(r) > 0 FROM Rental r WHERE r.product.id = :productId " +
           "AND (r.startDate <= :endDate AND r.endDate >= :startDate) " +
           "AND r.status != 'CANCELLED'")
    boolean existsOverlappingRental(@Param("productId") Long productId, 
                                    @Param("startDate") LocalDate startDate, 
                                    @Param("endDate") LocalDate endDate);

    // Récupérer les réservations d'un produit sur une période donnée (pour le calendrier)
    @Query("SELECT r FROM Rental r WHERE r.product.id = :productId " +
           "AND r.startDate <= :endDate AND r.endDate >= :startDate " +
           "AND r.status != 'CANCELLED'")
    List<Rental> findRentalsForProductInDateRange(@Param("productId") Long productId,
                                                  @Param("startDate") LocalDate startDate,
                                                  @Param("endDate") LocalDate endDate);
}
```

### D. Services (La logique métier)

**`service/ProductService.java`**
```java
package com.locaauto.api.service;

import com.locaauto.api.dto.DayAvailability;
import com.locaauto.api.model.Product;
import com.locaauto.api.model.Rental;
import com.locaauto.api.repository.ProductRepository;
import com.locaauto.api.repository.RentalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private RentalRepository rentalRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Long> getAvailableProductIds(LocalDate start, LocalDate end) {
        return productRepository.findAvailableProductIds(start, end);
    }

    /**
     * Génère le calendrier de disponibilité pour 120 jours (30 jours passés, 90 futurs)
     */
    public List<DayAvailability> getProductCalendar(Long productId) {
        LocalDate start = LocalDate.now().minusDays(30);
        LocalDate end = LocalDate.now().plusDays(90);

        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));

        // Récupérer toutes les locations qui touchent cette période pour éviter de faire N requêtes SQL
        List<Rental> activeRentals = rentalRepository.findRentalsForProductInDateRange(productId, start, end);

        List<DayAvailability> calendar = new ArrayList<>();

        // Boucle jour par jour
        for (LocalDate date = start; !date.isAfter(end); date = date.plusDays(1)) {
            boolean isReserved = false;
            
            // Vérification en mémoire (rapide)
            for (Rental r : activeRentals) {
                if (!date.isBefore(r.getStartDate()) && !date.isAfter(r.getEndDate())) {
                    isReserved = true;
                    break;
                }
            }
            calendar.add(new DayAvailability(date, isReserved, product.getPricePerDay()));
        }
        return calendar;
    }
}
```

**`service/RentalService.java`**
```java
package com.locaauto.api.service;

import com.locaauto.api.dto.RentalRequest;
import com.locaauto.api.model.Product;
import com.locaauto.api.model.Rental;
import com.locaauto.api.repository.ProductRepository;
import com.locaauto.api.repository.RentalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RentalService {

    @Autowired
    private RentalRepository rentalRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Rental> getAllRentals() {
        return rentalRepository.findAll();
    }

    public boolean checkAvailability(Long productId, LocalDate start, LocalDate end) {
        return !rentalRepository.existsOverlappingRental(productId, start, end);
    }

    @Transactional
    public void createRental(RentalRequest request) {
        // Double vérification de sécurité côté serveur
        if (!checkAvailability(request.getProductId(), request.getStartDate(), request.getEndDate())) {
            throw new RuntimeException("Ce véhicule n'est plus disponible pour ces dates.");
        }

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Produit introuvable"));

        Rental rental = new Rental();
        rental.setProduct(product);
        rental.setStartDate(request.getStartDate());
        rental.setEndDate(request.getEndDate());
        rental.setTotalPrice(request.getTotalPrice());
        rental.setStatus("PENDING"); // En attente de validation ou paiement

        rentalRepository.save(rental);
    }
}
```

### E. Controllers (Endpoints REST)

**`controller/ProductController.java`**
```java
package com.locaauto.api.controller;

import com.locaauto.api.dto.DayAvailability;
import com.locaauto.api.model.Product;
import com.locaauto.api.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000") // Important pour React
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/available-ids")
    public List<Long> getAvailableIds(@RequestParam LocalDate startDate, @RequestParam LocalDate endDate) {
        return productService.getAvailableProductIds(startDate, endDate);
    }

    @GetMapping("/{id}/calendar-full")
    public List<DayAvailability> getProductCalendar(@PathVariable Long id) {
        return productService.getProductCalendar(id);
    }
}
```

**`controller/RentalController.java`**
```java
package com.locaauto.api.controller;

import com.locaauto.api.dto.RentalRequest;
import com.locaauto.api.model.Rental;
import com.locaauto.api.service.RentalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/rentals")
@CrossOrigin(origins = "http://localhost:3000")
public class RentalController {

    @Autowired
    private RentalService rentalService;

    @GetMapping("/my-rentals")
    public List<Rental> getMyRentals() {
        // TODO: Filtrer par utilisateur connecté (Spring Security)
        return rentalService.getAllRentals();
    }

    @GetMapping("/check-availability")
    public boolean checkAvailability(@RequestParam Long productId, 
                                     @RequestParam LocalDate startDate, 
                                     @RequestParam LocalDate endDate) {
        return rentalService.checkAvailability(productId, startDate, endDate);
    }

    @PostMapping
    public ResponseEntity<?> createRental(@RequestBody RentalRequest request) {
        try {
            rentalService.createRental(request);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
```

## 5. Lancement

1. Copiez ces fichiers dans votre structure Java.
2. Lancez l'application Spring Boot.
3. Hibernate va créer automatiquement les tables `products`, `rentals`, `product_options` dans Supabase.
4. **Important :** Insérez manuellement quelques produits dans la table `products` via l'interface Supabase (Table Editor) pour avoir des données à afficher côté React, car la base sera vide au départ.

