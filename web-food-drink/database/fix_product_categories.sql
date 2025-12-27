-- Fix product categories after re-creating categories table
SET NAMES 'utf8mb4';
SET CHARACTER SET utf8mb4;

-- Get the new category IDs
SET @food_id = (SELECT id FROM categories WHERE type = 'food' LIMIT 1);
SET @drink_id = (SELECT id FROM categories WHERE type = 'drink' LIMIT 1);

-- Update products with drink-related names to drink category
UPDATE products SET category_id = @drink_id 
WHERE LOWER(name) LIKE '%trà%' 
   OR LOWER(name) LIKE '%nước%'
   OR LOWER(name) LIKE '%sinh tố%'
   OR LOWER(name) LIKE '%cafe%'
   OR LOWER(name) LIKE '%cà phê%'
   OR LOWER(name) LIKE '%sữa%'
   OR LOWER(name) LIKE '%juice%'
   OR LOWER(name) LIKE '%smoothie%';

-- Update remaining products to food category
UPDATE products SET category_id = @food_id WHERE category_id IS NULL;

-- Verify the update
SELECT 
    c.name as category,
    COUNT(p.id) as product_count
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.name;
