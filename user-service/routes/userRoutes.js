const express = require('express');
const router = express.Router();
const { createUser, getUserByAuthId, updateUser } = require('../controllers/userController');
const apiKeyMiddleware = require('../middleware/apiKeyMiddleware');

// Tạo user (chỉ internal service)
router.post('/create', apiKeyMiddleware, createUser);

// Lấy thông tin user theo auth_id
router.get('/:auth_id', getUserByAuthId);

// Cập nhật thông tin user
router.put('/:auth_id', updateUser);

module.exports = router;
