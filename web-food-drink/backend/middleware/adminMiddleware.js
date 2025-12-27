const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'yêu cầu quyền quản trị viên' });
    }
};

module.exports = adminMiddleware;
