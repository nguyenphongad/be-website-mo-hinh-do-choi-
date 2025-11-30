const express = require('express');
const router = express.Router();
const { register, loginAdmin, loginUser, verifyToken } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Đăng ký
router.post('/register', register);

// Đăng nhập admin
router.post('/login/admin', loginAdmin);

// Đăng nhập user
router.post('/login/user', loginUser);

// Xác thực token
router.get('/verify', authMiddleware, verifyToken);

module.exports = router;
