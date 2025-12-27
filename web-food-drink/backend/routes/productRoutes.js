const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public: Lấy tất cả sản phẩm với phân trang
router.get('/', async (req, res) => {
    try {
        const { category, search, page = 1, limit = 10 } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);
        
        let query = 'SELECT p.* FROM products p';
        let countQuery = 'SELECT COUNT(*) as total FROM products p';
        let whereClause = ' WHERE 1=1';
        const params = [];
        const countParams = [];

        // Support both category_id and category type (food/drink)
        if (category) {
            // Check if category is a number (ID) or string (type)
            if (!isNaN(category)) {
                whereClause += ' AND p.category_id = ?';
                params.push(category);
                countParams.push(category);
            } else {
                // Filter by category type (food/drink)
                query = 'SELECT p.* FROM products p JOIN categories c ON p.category_id = c.id';
                countQuery = 'SELECT COUNT(*) as total FROM products p JOIN categories c ON p.category_id = c.id';
                whereClause += ' AND c.type = ?';
                params.push(category);
                countParams.push(category);
            }
        }
        
        if (search) {
            whereClause += ' AND p.name LIKE ?';
            params.push(`%${search}%`);
            countParams.push(`%${search}%`);
        }
        
        query += whereClause + ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
        countQuery += whereClause;
        params.push(parseInt(limit), offset);

        const [rows] = await pool.query(query, params);
        const [countResult] = await pool.query(countQuery, countParams);
        const total = countResult[0].total;
        
        res.json({
            data: rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: total,
                totalPages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Tạo sản phẩm
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), async (req, res) => {
    try {
        const { name, description, price, category_id } = req.body;
        const image_url = req.file ? `/uploads/images/${req.file.filename}` : null;

        if (!name || !price) {
            return res.status(400).json({ message: 'Tên và giá là bắt buộc' });
        }

        // 1. MySQL
        const [result] = await pool.query(
            'INSERT INTO products (name, description, price, image_url, category_id) VALUES (?, ?, ?, ?, ?)',
            [name, description, price, image_url, category_id]
        );
        const productId = result.insertId;

        res.status(201).json({ message: 'Thêm sản phẩm thành công' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Admin: Cập nhật sản phẩm
router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category_id } = req.body;
    
    try {
        // 1. MySQL
        let query = 'UPDATE products SET name=?, description=?, price=?, category_id=?';
        let params = [name, description, price, category_id];

        let image_url = null;
        if (req.file) {
            query += ', image_url=?';
            image_url = `/uploads/images/${req.file.filename}`;
            params.push(image_url);
        }

        query += ' WHERE id=?';
        params.push(id);

        await pool.query(query, params);

        res.json({ message: 'Cập nhật thành công' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Admin: Xóa sản phẩm
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM products WHERE id=?', [id]);

        res.json({ message: 'Xóa thành công' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
