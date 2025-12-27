const express = require('express');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '../.env') }); // Load .env from backend root

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set UTF-8 charset for all JSON responses
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
});

// Phục vụ Frontend Tĩnh với UTF-8 charset
app.use(express.static(path.join(__dirname, '../../frontend'), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
        } else if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        } else if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css; charset=utf-8');
        }
    }
}));

// Pool Kết Nối Cơ Sở Dữ Liệu
const pool = require('./db');

// Kiểm tra kết nối DB
app.get('/api/health', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1');
        res.json({ status: 'ok', db: 'connected' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', db: 'disconnected', error: err.message });
    }
});

// Routes
const authRoutes = require('../routes/authRoutes');
const cartRoutes = require('../routes/cartRoutes');
const orderRoutes = require('../routes/orderRoutes');
const productRoutes = require('../routes/productRoutes');

// Phục vụ thư mục Uploads (/usr/src/uploads)
app.use('/uploads', express.static('/usr/src/uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/users', require('../routes/userRoutes')); // Mount user routes
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', require('../routes/adminRoutes')); // Admin routes
app.use('/api', require('../routes/setupRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(err.status || 500).json({ 
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Route bắt tất cả để phục vụ index.html cho các request không phải API
app.get('*', (req, res) => {
    // Don't catch API routes
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ message: 'API endpoint not found' });
    }
    res.sendFile(path.join(__dirname, '../../frontend/html/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
