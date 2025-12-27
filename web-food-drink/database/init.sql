-- Create Database with UTF-8 charset
CREATE DATABASE IF NOT EXISTS food_beverage_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE food_beverage_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    role ENUM('user', 'admin') DEFAULT 'user',
    phone VARCHAR(15),
    dob DATE,
    gender ENUM('male', 'female', 'other'),
    address TEXT,
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('food', 'drink') NOT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    category_id INT,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Carts Table (Persistent cart for users)
CREATE TABLE IF NOT EXISTS carts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_cart_item (user_id, product_id)
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    user_order_number INT NOT NULL DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'paid', 'delivered', 'cancelled') DEFAULT 'pending',
    payment_method ENUM('cod', 'banking') DEFAULT 'cod',
    recipient_name VARCHAR(255) NOT NULL,
    recipient_address TEXT NOT NULL,
    recipient_phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_order (user_id, user_order_number)
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price_at_time DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_type ENUM('percent', 'fixed') NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    expiry_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Categories
INSERT INTO categories (name, type, image_url) VALUES 
('Đồ ăn', 'food', NULL),
('Nước uống', 'drink', NULL);

-- Seed Admin User (admin@example.com / admin)
INSERT INTO users (name, email, password_hash, role, phone, address) VALUES 
('Admin', 'admin@example.com', '$2a$10$IrxbXqXttxy5VSWedxYA1ujeeyfFZzH2FszR8ueW4ndUZIFzm0a5a', 'admin', '0123456789', 'Admin Office');

-- Seed User Account (tphamvo41@gmail.com / 123456)
INSERT INTO users (name, email, password_hash, role, phone, address) VALUES 
('User Test', 'tphamvo41@gmail.com', '$2a$10$GAhNwMrTFsgea0lArfvuzullWPWFTPZwcFUQFnsF6Xwmqid5j9/62', 'user', '0987654321', 'User Address');
