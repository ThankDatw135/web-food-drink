const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Sử dụng lại pool từ module cấu hình db hoặc tạo mới ở đây. 
// Lý tưởng nhất là trích xuất ra config/db.js nhưng để đơn giản tôi sẽ lặp lại cấu hình kết nối hoặc giả định biến toàn cục.
// Hãy tạo file config db trước để tránh trùng lặp.
// NHƯNG hiện tại, tôi sẽ để nó ở đây để tự chứa trong bước này, sau đó cấu trúc lại.
// Khoan, tôi không thể chia sẻ pool dễ dàng từ server.js nếu nó được định nghĩa ở đó. 
// Tôi nên tạo config/db.js trước.

const pool = require('../config/db');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
    }

    try {
        // Kiểm tra nếu admin tồn tại
        const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }

        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Thêm người dùng
        await pool.query('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)', [name, email, hashedPassword]);

        res.status(201).json({ message: 'Đăng ký thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        const user = users[0];

        // Kiểm tra mật khẩu
        if (!user.password_hash) {
             return res.status(400).json({ message: 'Tài khoản này không hỗ trợ đăng nhập mật khẩu' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        // Tạo JWT
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar_url: user.avatar_url
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};
