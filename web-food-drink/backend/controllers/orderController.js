const pool = require('../config/db');

exports.createOrder = async (req, res) => {
    const userId = req.user.id;
    const { recipientName, recipientAddress, recipientPhone, paymentMethod } = req.body;

    if (!recipientName || !recipientAddress || !recipientPhone) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin giao hàng' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Lấy sản phẩm trong giỏ hàng
        const [cartItems] = await connection.query(
            `SELECT c.quantity, p.id as product_id, p.name, p.price 
             FROM carts c 
             JOIN products p ON c.product_id = p.id 
             WHERE c.user_id = ?`,
            [userId]
        );

        if (cartItems.length === 0) {
            await connection.rollback();
            return res.status(400).json({ message: 'Giỏ hàng trống' });
        }

        // 2. Tính tổng tiền
        let totalAmount = 0;
        cartItems.forEach(item => {
            totalAmount += item.price * item.quantity;
        });
        // Cộng phí vận chuyển cố định 30000
        totalAmount += 30000;

        // 3. Get next order number for this user
        const [maxOrder] = await connection.query(
            'SELECT COALESCE(MAX(user_order_number), 0) as max_num FROM orders WHERE user_id = ?',
            [userId]
        );
        const nextOrderNumber = maxOrder[0].max_num + 1;

        // 4. Tạo đơn hàng
        const [orderResult] = await connection.query(
            `INSERT INTO orders (user_id, user_order_number, total_amount, status, payment_method, recipient_name, recipient_address, recipient_phone) 
             VALUES (?, ?, ?, 'pending', ?, ?, ?, ?)`,
            [userId, nextOrderNumber, totalAmount, paymentMethod || 'cod', recipientName, recipientAddress, recipientPhone]
        );
        const orderId = orderResult.insertId;

        // 4. Tạo chi tiết đơn hàng
        for (const item of cartItems) {
            await connection.query(
                `INSERT INTO order_items (order_id, product_id, quantity, price_at_time) 
                 VALUES (?, ?, ?, ?)`,
                [orderId, item.product_id, item.quantity, item.price]
            );
        }

        // 5. Xóa giỏ hàng
        await connection.query('DELETE FROM carts WHERE user_id = ?', [userId]);

        await connection.commit();

        res.status(201).json({ message: 'Đặt hàng thành công', orderId });

    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Lỗi server khi tạo đơn hàng' });
    } finally {
        connection.release();
    }
};

exports.getOrders = async (req, res) => {
    const userId = req.user.id;
    try {
        const [orders] = await pool.query(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.getOrderHistory = async (req, res) => {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    try {
        // Get total count
        const [countResult] = await pool.query(
            'SELECT COUNT(*) as total FROM orders WHERE user_id = ?',
            [userId]
        );
        const total = countResult[0].total;
        
        // Get orders with pagination
        const [orders] = await pool.query(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
            [userId, parseInt(limit), offset]
        );

        // For each order, get the order items with product details
        const ordersWithItems = await Promise.all(
            orders.map(async (order) => {
                const [items] = await pool.query(
                    `SELECT oi.*, p.name, p.image_url, p.description 
                     FROM order_items oi 
                     JOIN products p ON oi.product_id = p.id 
                     WHERE oi.order_id = ?`,
                    [order.id]
                );
                return {
                    ...order,
                    items
                };
            })
        );

        res.json({
            data: ordersWithItems,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: total,
                totalPages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Error in getOrderHistory:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.deleteOrder = async (req, res) => {
    const userId = req.user.id;
    const orderId = req.params.orderId;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Check if order belongs to user
        const [orders] = await connection.query(
            'SELECT * FROM orders WHERE id = ? AND user_id = ?',
            [orderId, userId]
        );

        if (orders.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        // Delete order items first (foreign key constraint)
        await connection.query('DELETE FROM order_items WHERE order_id = ?', [orderId]);

        // Delete order
        await connection.query('DELETE FROM orders WHERE id = ?', [orderId]);

        await connection.commit();
        res.json({ message: 'Xóa đơn hàng thành công' });

    } catch (error) {
        await connection.rollback();
        console.error('Error in deleteOrder:', error);
        res.status(500).json({ message: 'Lỗi server khi xóa đơn hàng' });
    } finally {
        connection.release();
    }
};
