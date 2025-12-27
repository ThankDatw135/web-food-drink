-- Fix category names to display Vietnamese correctly
-- This script updates category names from English to Vietnamese

USE food_beverage_db;

-- Set connection charset to UTF-8
SET NAMES 'utf8mb4';
SET CHARACTER SET utf8mb4;

-- Update existing categories to Vietnamese names
UPDATE categories SET name = 'Đồ Ăn' WHERE name = 'Food';
UPDATE categories SET name = 'Nước Uống' WHERE name = 'Beverages';

-- Verify the changes
SELECT id, name, type FROM categories ORDER BY id;
