const pool = require('../config/db');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
    try {
        // Total revenue
        const [totalRevenue] = await pool.query(
            'SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE status IN ("paid", "delivered")'
        );

        // Total orders
        const [totalOrders] = await pool.query(
            'SELECT COUNT(*) as total FROM orders'
        );

        // Total products
        const [totalProducts] = await pool.query(
            'SELECT COUNT(*) as total FROM products'
        );

        // Total customers
        const [totalCustomers] = await pool.query(
            'SELECT COUNT(*) as total FROM users WHERE role = "user"'
        );

        // Daily revenue (today)
        const [dailyRevenue] = await pool.query(
            `SELECT COALESCE(SUM(total_amount), 0) as total 
             FROM orders 
             WHERE DATE(created_at) = CURDATE() 
             AND status IN ("paid", "delivered")`
        );

        // Daily products sold (today)
        const [dailyProducts] = await pool.query(
            `SELECT COALESCE(SUM(oi.quantity), 0) as total
             FROM order_items oi
             JOIN orders o ON oi.order_id = o.id
             WHERE DATE(o.created_at) = CURDATE()
             AND o.status IN ("paid", "delivered")`
        );

        res.json({
            totalRevenue: totalRevenue[0].total,
            totalOrders: totalOrders[0].total,
            totalProducts: totalProducts[0].total,
            totalCustomers: totalCustomers[0].total,
            dailyRevenue: dailyRevenue[0].total,
            dailyProductsSold: dailyProducts[0].total
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get monthly revenue data (last 12 months)
exports.getMonthlyRevenue = async (req, res) => {
    try {
        const [monthlyData] = await pool.query(
            `SELECT 
                DATE_FORMAT(created_at, '%Y-%m') as month,
                COALESCE(SUM(total_amount), 0) as revenue
             FROM orders
             WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
             AND status IN ("paid", "delivered")
             GROUP BY DATE_FORMAT(created_at, '%Y-%m')
             ORDER BY month ASC`
        );

        // Fill in missing months with 0
        const result = [];
        const now = new Date();
        for (let i = 11; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const found = monthlyData.find(d => d.month === monthKey);
            result.push({
                month: monthKey,
                revenue: found ? parseFloat(found.revenue) : 0
            });
        }

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get weekly revenue data (last 7 days)
exports.getWeeklyRevenue = async (req, res) => {
    try {
        const [weeklyData] = await pool.query(
            `SELECT 
                DATE(created_at) as day,
                COALESCE(SUM(total_amount), 0) as revenue
             FROM orders
             WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
             AND status IN ("paid", "delivered")
             GROUP BY DATE(created_at)
             ORDER BY day ASC`
        );

        // Fill in missing days with 0
        const result = [];
        const now = new Date();
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dayKey = date.toISOString().split('T')[0];
            const found = weeklyData.find(d => {
                const dbDay = new Date(d.day).toISOString().split('T')[0];
                return dbDay === dayKey;
            });
            result.push({
                day: dayKey,
                revenue: found ? parseFloat(found.revenue) : 0
            });
        }

        console.log('Weekly revenue result:', result);
        res.json(result);
    } catch (error) {
        console.error('Error in getWeeklyRevenue:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        await connection.query("SET NAMES 'utf8mb4'");
        
        const [categories] = await connection.query(
            'SELECT id, name, type FROM categories ORDER BY id ASC'
        );
        
        connection.release();
        res.json(categories);
    } catch (error) {
        console.error('Error in getAllCategories:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get category distribution
exports.getCategoryDistribution = async (req, res) => {
    try {
        // Get a connection and set charset
        const connection = await pool.getConnection();
        await connection.query("SET NAMES 'utf8mb4'");
        
        const [categoryData] = await connection.query(
            `SELECT 
                c.name as category,
                COALESCE(SUM(oi.quantity * oi.price_at_time), 0) as revenue,
                COALESCE(SUM(oi.quantity), 0) as quantity
             FROM categories c
             LEFT JOIN products p ON c.id = p.category_id
             LEFT JOIN order_items oi ON p.id = oi.product_id
             LEFT JOIN orders o ON oi.order_id = o.id
             WHERE o.id IS NULL OR o.status IN ("paid", "delivered")
             GROUP BY c.id, c.name
             ORDER BY revenue DESC`
        );
        
        connection.release();

        const result = categoryData.map(item => ({
            category: item.category,
            revenue: parseFloat(item.revenue) || 0,
            quantity: parseInt(item.quantity) || 0
        }));

        console.log('Category distribution result:', result);
        res.json(result);
    } catch (error) {
        console.error('Error in getCategoryDistribution:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all orders for admin with pagination
exports.getAllOrders = async (req, res) => {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    try {
        let query = `SELECT o.*, u.name as user_name, u.email as user_email 
                     FROM orders o 
                     JOIN users u ON o.user_id = u.id 
                     WHERE 1=1`;
        let countQuery = `SELECT COUNT(*) as total FROM orders WHERE 1=1`;
        const params = [];
        const countParams = [];
        
        if (status) {
            query += ' AND o.status = ?';
            countQuery += ' AND status = ?';
            params.push(status);
            countParams.push(status);
        }
        
        query += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), offset);
        
        const [orders] = await pool.query(query, params);
        const [countResult] = await pool.query(countQuery, countParams);
        const total = countResult[0].total;
        
        // Get items for each order
        const ordersWithItems = await Promise.all(
            orders.map(async (order) => {
                const [items] = await pool.query(
                    `SELECT oi.*, p.name, p.image_url 
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
        console.error('Error in getAllOrders:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['pending', 'paid', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
    }
    
    try {
        await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
        res.json({ message: 'Cập nhật trạng thái thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
