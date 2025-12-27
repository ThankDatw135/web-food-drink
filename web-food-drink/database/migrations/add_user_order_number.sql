-- Migration: Add user_order_number column to orders table
-- This allows each user to have their own order numbering sequence starting from 1

USE food_beverage_db;

-- Add user_order_number column
ALTER TABLE orders ADD COLUMN user_order_number INT NOT NULL DEFAULT 0 AFTER user_id;

-- Populate existing orders with correct user_order_number
-- This uses variables to track and increment order numbers per user
SET @user_id := 0;
SET @order_num := 0;

UPDATE orders o1
JOIN (
    SELECT 
        id,
        user_id,
        @order_num := IF(@user_id = user_id, @order_num + 1, 1) AS new_order_num,
        @user_id := user_id
    FROM orders
    ORDER BY user_id, created_at
) o2 ON o1.id = o2.id
SET o1.user_order_number = o2.new_order_num;

-- Add index for better query performance
CREATE INDEX idx_user_order ON orders(user_id, user_order_number);

-- Verify the changes
SELECT user_id, user_order_number, id, total_amount, created_at 
FROM orders 
ORDER BY user_id, user_order_number
LIMIT 20;
