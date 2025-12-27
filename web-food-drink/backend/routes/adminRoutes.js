const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// Middleware to check admin role
const adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
};

// Apply auth and admin check to all routes
router.use(authMiddleware);
router.use(adminOnly);

// Dashboard statistics
router.get('/stats', adminController.getDashboardStats);
router.get('/revenue/monthly', adminController.getMonthlyRevenue);
router.get('/revenue/weekly', adminController.getWeeklyRevenue);
router.get('/categories/distribution', adminController.getCategoryDistribution);
router.get('/categories', adminController.getAllCategories);

// Orders management
router.get('/orders', adminController.getAllOrders);
router.put('/orders/:orderId/status', adminController.updateOrderStatus);

module.exports = router;
