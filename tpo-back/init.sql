-- Establecer codificación UTF-8 para la sesión
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
SET CHARACTER SET utf8mb4;

CREATE DATABASE IF NOT EXISTS ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE ecommerce_db;

-- El usuario ya se crea automáticamente por las variables de entorno de MySQL
-- Pero podemos asegurar permisos adicionales si es necesario
GRANT ALL PRIVILEGES ON ecommerce_db.* TO 'ecom_user'@'%';
FLUSH PRIVILEGES;

-- CREAR TABLAS PRIMERO
CREATE TABLE IF NOT EXISTS categoria (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(500),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS usuario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    avatar VARCHAR(500),
    seller_nickname VARCHAR(255),
    seller_reputation VARCHAR(50),
    seller_description TEXT,
    seller_location VARCHAR(255),
    seller_phone VARCHAR(50),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS producto (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'ARS',
    condition_type VARCHAR(50),
    free_shipping BOOLEAN DEFAULT FALSE,
    category_id BIGINT,
    seller_id BIGINT,
    location VARCHAR(255),
    description TEXT,
    stock INT DEFAULT 0,
    installments_quantity INT,
    installments_amount DECIMAL(15,2),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categoria(id),
    FOREIGN KEY (seller_id) REFERENCES usuario(id)
);

CREATE TABLE IF NOT EXISTS producto_imagen (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    producto_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    orden INT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES producto(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS producto_tag (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    producto_id BIGINT NOT NULL,
    tag_name VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES producto(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS carrito (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS carrito_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    carrito_id BIGINT NOT NULL,
    producto_id BIGINT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(15,2) NOT NULL,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (carrito_id) REFERENCES carrito(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES producto(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS favorito (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    producto_id BIGINT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES producto(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorito (usuario_id, producto_id)
);

-- INSERTAR CATEGORÍAS (sin IDs específicos)
INSERT IGNORE INTO categoria (name, description, image, created_at) VALUES
('Electrónica', 'Dispositivos electrónicos y tecnología', 'https://via.placeholder.com/300x200?text=Electronics', NOW()),
('Indumentaria', 'Ropa y accesorios de moda', 'https://via.placeholder.com/300x200?text=Clothing', NOW()),
('Casa y Jardín', 'Artículos para el hogar y jardín', 'https://via.placeholder.com/300x200?text=Home+Garden', NOW()),
('Deportes', 'Artículos deportivos y fitness', 'https://via.placeholder.com/300x200?text=Sports', NOW()),
('Libros', 'Libros y material de lectura', 'https://via.placeholder.com/300x200?text=Books', NOW()),
('Juguetes', 'Juguetes y entretenimiento', 'https://via.placeholder.com/300x200?text=Toys', NOW()),
('Automotriz', 'Autopartes y accesorios para vehículos', 'https://via.placeholder.com/300x200?text=Automotive', NOW()),
('Salud y Belleza', 'Productos de salud y belleza', 'https://via.placeholder.com/300x200?text=Health+Beauty', NOW()),
('Música', 'Instrumentos musicales y audio', 'https://via.placeholder.com/300x200?text=Music', NOW()),
('Mascotas', 'Productos para mascotas', 'https://via.placeholder.com/300x200?text=Pet+Supplies', NOW()),
('Otros', 'Otros productos', 'https://via.placeholder.com/300x200?text=Others', NOW());

-- INSERTAR USUARIOS (sin IDs específicos, usando passwords hasheadas)
INSERT IGNORE INTO usuario (email, password, first_name, last_name, role, avatar, seller_nickname, seller_reputation, seller_description, seller_location, seller_phone, created_at) VALUES 
('admin@mercadolibre.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', 'admin', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 'ADMIN_STORE', 'gold', 'Tienda oficial de administración', 'Capital Federal', '‪+54 11 1234-5678‬', NOW()),
('user@test.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Juan', 'Pérez', 'user', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', 'APPLE_STORE_ARG', 'gold', 'Distribuidor oficial de productos Apple en Argentina', 'Capital Federal', '‪+54 11 2345-6789‬', NOW()),
('prueba1@hotmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Carlos', 'González', 'user', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face', 'SAMSUNG_OFICIAL', 'gold', 'Tienda oficial Samsung Argentina', 'Buenos Aires', '‪+54 11 3456-7890‬', NOW()),
('prueba2@hotmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'María', 'López', 'user', 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face', 'TECH_SHOP', 'silver', 'Productos tecnológicos de calidad', 'Córdoba', '‪+54 351 456-7890‬', NOW()),
('prueba3@hotmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Ana', 'Martínez', 'user', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', 'ELECTRONICS_PLUS', 'bronze', 'Electrónicos al mejor precio', 'Rosario', '‪+54 341 567-8901‬', NOW()),
('eliel@mercadolibre.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Eliel', 'Lanzillotta', 'user', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', 'ELIEL_STORE', 'silver', 'Vendedor confiable con años de experiencia', 'Capital Federal', '+54 11 678-9012', NOW()),
('e.h.lanzillotta@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Eliel', 'H', 'user', 'https://via.placeholder.com/150', 'ELIEL_TECH', 'bronze', 'Tecnología y más', 'Buenos Aires', '+54 11 789-0123', NOW()),
('admin2@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin2', 'Sistema', 'user', 'https://via.placeholder.com/150', 'ADMIN2_STORE', 'bronze', 'Segunda tienda administrativa', 'Capital Federal', '+54 11 890-1234', NOW()),
('nicolas@test.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Nicolas', 'Store', 'user', 'https://via.placeholder.com/150', 'NICOLAS_STORE', 'bronze', 'Tienda de Nicolas', 'Argentina', '+54 11 999-0000', NOW());

-- INSERTAR PRODUCTOS (sin IDs específicos, usando referencias por posición)
INSERT IGNORE INTO producto (title, price, currency, condition_type, free_shipping, category_id, seller_id, location, description, stock, installments_quantity, installments_amount, created_at) VALUES 
-- Electrónica (category_id = 1, sellers 2 y 3)
('iPhone 14 Pro 128GB', 899999.00, 'ARS', 'new_', true, 1, 2, 'Capital Federal', 'iPhone 14 Pro con pantalla Super Retina XDR de 6.1 pulgadas, chip A16 Bionic y sistema de cámaras Pro avanzado.', 15, 12, 74999.00, NOW()),
('Samsung Galaxy S23 256GB', 649999.00, 'ARS', 'new_', true, 1, 3, 'Buenos Aires', 'Galaxy S23 con cámara de 50MP, pantalla Dynamic AMOLED de 6.1 pulgadas y procesador Snapdragon 8 Gen 2.', 8, 18, 36111.00, NOW()),
('Notebook Lenovo IdeaPad 3 15.6" Intel Core i5', 589999.00, 'ARS', 'new_', false, 1, 2, 'Córdoba', 'Notebook Lenovo IdeaPad 3 con procesador Intel Core i5, 8GB RAM, 256GB SSD, pantalla 15.6 pulgadas.', 12, 12, 49166.00, NOW()),
('Smart TV Samsung 55" 4K UHD', 449999.00, 'ARS', 'new_', true, 1, 3, 'Rosario', 'Smart TV Samsung 55 pulgadas 4K UHD con Tizen OS, HDR10+ y control por voz.', 5, 24, 18750.00, NOW()),
('MacBook Air M2 256GB', 1299999.00, 'ARS', 'new_', true, 1, 2, 'Capital Federal', 'MacBook Air con chip M2, pantalla Liquid Retina de 13.6 pulgadas y hasta 18 horas de batería.', 1, 18, 72222.00, NOW()),
('AirPods Pro 2da Gen', 399999.00, 'ARS', 'new_', true, 1, 2, 'Capital Federal', 'AirPods Pro 2da generación con cancelación activa de ruido y audio espacial.', 9, 18, 22222.00, NOW()),

-- Deportes (category_id = 4, seller 4)
('Zapatillas Nike Air Max 270', 89999.00, 'ARS', 'new_', true, 4, 4, 'Capital Federal', 'Zapatillas Nike Air Max 270 con unidad Air visible y diseño moderno para máximo confort.', 20, 6, 15000.00, NOW()),
('Adidas Ultraboost 22', 149999.00, 'ARS', 'new_', true, 4, 4, 'Capital Federal', 'Zapatillas Adidas Ultraboost 22 con tecnología BOOST y upper Primeknit.', 18, 12, 12500.00, NOW()),

-- Indumentaria (category_id = 2, sellers 4 y 6)
('Remera Nike Dri-FIT', 15999.00, 'ARS', 'new_', true, 2, 4, 'Capital Federal', 'Remera deportiva Nike con tecnología Dri-FIT para máxima comodidad.', 30, 6, 2667.00, NOW()),
('Jean Levis 501 Original', 45999.00, 'ARS', 'new_', true, 2, 6, 'Buenos Aires', 'Jean clásico Levis 501 corte original, 100% algodón.', 15, 12, 3833.00, NOW());

-- INSERTAR IMÁGENES DE PRODUCTOS (solo si no existen)
INSERT IGNORE INTO producto_imagen (producto_id, image_url, orden) VALUES 
('1', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600', 1),
('1', 'https://images.unsplash.com/photo-1678652197831-2d180705cd2c?w=600', 2),
('2', 'https://http2.mlstatic.com/D_NQ_NP_2X_901457-MLA69825923980_062023-F.webp', 1),
('5', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600', 1),
('20', 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=600', 1),
('3', 'https://http2.mlstatic.com/D_NQ_NP_2X_612304-MLA45729434228_042021-F.webp', 1),
('4', 'https://http2.mlstatic.com/D_NQ_NP_2X_923746-MLA46516512683_062021-F.webp', 1),
('17', 'https://www.dexter.com.ar/on/demandware.static/-/Sites-365-dabra-catalog/default/dw4920bc6d/products/ADHP9189/ADHP9189-1.JPG', 1);

-- INSERTAR TAGS DE PRODUCTOS (solo si no existen)
INSERT IGNORE INTO producto_tag (producto_id, tag_name) VALUES 
('1', 'Más vendido'),
('1', 'Envío gratis'),
('2', 'Nuevo'),
('2', 'Envío gratis'),
('5', 'Más vendido'),
('5', 'Deportes'),
('20', 'Apple'),
('20', 'Envío gratis'),
('17', 'Adidas'),
('17', 'Running'),
('9', 'Apple'),
('9', 'Laptop'),
('4', 'Smart TV'),
('4', 'Samsung');

-- CREAR ALGUNOS CARRITOS (solo si no existen)
INSERT IGNORE INTO carrito (id, usuario_id, created_at, updated_at) VALUES 
(1, '1', NOW(), NOW()),
(2, '3', NOW(), NOW()),
(3, '4', NOW(), NOW());

-- AGREGAR ITEMS AL CARRITO (solo si no existen)
INSERT IGNORE INTO carrito_item (id, carrito_id, producto_id, cantidad, precio_unitario, added_at) VALUES 
(1, 1, '1', 1, 899999.00, NOW()),
(2, 1, '5', 2, 89999.00, NOW()),
(3, 2, '2', 1, 649999.00, NOW()),
(4, 2, '20', 1, 399999.00, NOW()),
(5, 3, '17', 1, 149999.00, NOW()),
(6, 3, '18', 3, 25999.00, NOW());

-- AGREGAR FAVORITOS (solo si no existen)
INSERT IGNORE INTO favorito (usuario_id, producto_id, created_at) VALUES 
('1', '1', NOW()),
('1', '20', NOW()),
('1', '9', NOW()),
('3', '2', NOW()),
('3', '4', NOW()),
('3', '17', NOW()),
('4', '5', NOW()),
('4', '21', NOW()),
('6', '1', NOW()),
('6', '7', NOW());