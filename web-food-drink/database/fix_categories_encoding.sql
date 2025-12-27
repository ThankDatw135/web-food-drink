-- Fix encoding for categories table
-- Delete corrupted data and re-insert with correct encoding

SET NAMES 'utf8mb4';
SET CHARACTER SET utf8mb4;

-- Delete existing categories
DELETE FROM categories;

-- Reset auto increment
ALTER TABLE categories AUTO_INCREMENT = 1;

-- Insert categories with correct Vietnamese encoding
INSERT INTO categories (name, type, image_url) VALUES 
('Đồ ăn', 'food', NULL),
('Nước uống', 'drink', NULL);

-- Verify the insert
SELECT id, name, type, HEX(name) as hex_name FROM categories;
