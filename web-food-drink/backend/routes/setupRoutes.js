const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const bcrypt = require('bcryptjs');

router.get('/setup-admin', async (req, res) => {
    try {
        const email = 'admin@example.com';
        const password = 'admin'; // mật khẩu đơn giản
        
        // Mã hóa
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // Kiểm tra tồn tại
        const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.json({ message: 'Admin đã tồn tại. Đăng nhập: admin@example.com / admin' });
        }

        await pool.query(
            'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
            ['Administrator', email, hash, 'admin']
        );

        res.json({ message: 'Đã tạo Admin. Đăng nhập: admin@example.com / admin' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/migrate-profile', async (req, res) => {
    try {
        const columns = [
            "ADD COLUMN phone VARCHAR(15)",
            "ADD COLUMN dob DATE",
            "ADD COLUMN gender ENUM('male', 'female', 'other')",
            "ADD COLUMN address TEXT",
            "ADD COLUMN avatar_url VARCHAR(255)"
        ];

        let results = [];
        for (const col of columns) {
            try {
                await pool.query(`ALTER TABLE users ${col}`);
                results.push(`Success: ${col}`);
            } catch (err) {
                // Ignore error if column exists (Error 1060: Duplicate column name)
                if (err.code === 'ER_DUP_FIELDNAME') {
                    results.push(`Skipped (Exists): ${col}`);
                } else {
                    results.push(`Failed: ${col} - ${err.message}`);
                }
            }
        }
        res.json({ message: 'Migration completed', results });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
