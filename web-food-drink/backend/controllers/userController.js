const pool = require('../config/db');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

exports.getProfile = async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, name, email, phone, dob, gender, address, avatar_url, role FROM users WHERE id = ?', [req.user.id]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(users[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateProfile = async (req, res) => {
    const { name, phone, dob, gender, address } = req.body;
    try {
        // Tạo object để update, chỉ update các field có giá trị
        const updates = {};
        const values = [];
        
        if (name !== undefined) {
            updates.name = '?';
            values.push(name);
        }
        if (phone !== undefined) {
            updates.phone = '?';
            values.push(phone);
        }
        if (dob !== undefined) {
            updates.dob = '?';
            values.push(dob);
        }
        if (gender !== undefined) {
            updates.gender = '?';
            values.push(gender);
        }
        if (address !== undefined) {
            updates.address = '?';
            values.push(address);
        }
        
        // Nếu không có field nào để update
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'Không có thông tin để cập nhật' });
        }
        
        // Tạo câu query động
        const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
        values.push(req.user.id);
        
        await pool.query(
            `UPDATE users SET ${setClause} WHERE id = ?`,
            values
        );
        res.json({ message: 'Cập nhật thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.uploadAvatar = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    // URL to access the file (served statically)
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    try {
        await pool.query('UPDATE users SET avatar_url = ? WHERE id = ?', [avatarUrl, req.user.id]);
        res.json({ message: 'Avatar updated', avatarUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
    }

    // Validate new password strength
    if (newPassword.length < 6 || !/[A-Z]/.test(newPassword) || 
        !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
        return res.status(400).json({ 
            message: 'Mật khẩu mới phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số' 
        });
    }

    try {
        // Get current user password
        const [users] = await pool.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
        
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, users[0].password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Mật khẩu hiện tại không đúng' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.user.id]);

        res.json({ message: 'Đổi mật khẩu thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
