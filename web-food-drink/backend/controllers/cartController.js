const pool = require('../config/db');

exports.addToCart = async (req, res) => {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    // Mặc định số lượng là 1 nếu không chỉ định
    const qty = quantity || 1;

    try {
        // Kiểm tra sản phẩm có trong giỏ hàng chưa
        const [existing] = await pool.query(
            'SELECT * FROM carts WHERE user_id = ? AND product_id = ?', 
            [userId, productId]
        );

        if (existing.length > 0) {
            // Cập nhật số lượng
            const newQty = existing[0].quantity + qty;
            await pool.query(
                'UPDATE carts SET quantity = ? WHERE id = ?',
                [newQty, existing[0].id]
            );
        } else {
            // Thêm mới
            await pool.query(
                'INSERT INTO carts (user_id, product_id, quantity) VALUES (?, ?, ?)',
                [userId, productId, qty]
            );
        }

        res.json({ message: 'Đã thêm vào giỏ hàng' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.getCart = async (req, res) => {
    const userId = req.user.id;
    try {
        // Join với bảng products để lấy chi tiết
        const [items] = await pool.query(`
            SELECT c.id as cart_id, c.quantity, p.id as product_id, p.name, p.price, p.image_url 
            FROM carts c
            JOIN products p ON c.product_id = p.id
            WHERE c.user_id = ?
        `, [userId]);

        res.json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.updateCartItem = async (req, res) => {
    const userId = req.user.id;
    const { cartId, quantity } = req.body;

    if (quantity <= 0) {
        return exports.removeCartItem(req, res);
    }

    try {
        await pool.query(
            'UPDATE carts SET quantity = ? WHERE id = ? AND user_id = ?',
            [quantity, cartId, userId]
        );
        res.json({ message: 'Đã cập nhật số lượng' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.removeCartItem = async (req, res) => {
    const userId = req.user.id;
    const cartId = req.params.id || req.body.cartId; 

    try {
        await pool.query(
            'DELETE FROM carts WHERE id = ? AND user_id = ?',
            [cartId, userId]
        );
        res.json({ message: 'Đã xóa sản phẩm' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};
