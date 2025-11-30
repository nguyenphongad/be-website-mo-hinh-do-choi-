const Auth = require('../models/Auth');
const jwt = require('jsonwebtoken');
const axios = require('axios');

// Tạo JWT token
const generateToken = (authId) => {
  return jwt.sign({ authId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Đăng ký
const register = async (req, res) => {
  try {
    const { email, password, fullName, phone } = req.body;

    // Kiểm tra email đã tồn tại
    const existingAuth = await Auth.findOne({ email });
    if (existingAuth) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }

    // Tạo tài khoản auth
    const newAuth = new Auth({
      email,
      password,
      isAdmin: false
    });

    await newAuth.save();

    // Gọi API user-service để tạo thông tin user
    try {
      const userResponse = await axios.post(`${process.env.USER_SERVICE_URL}/api/users/create`, {
        auth_id: newAuth._id,
        fullName,
        phone,
        image: 'https://i.ibb.co/1ftbcwZ7/man.png'
      }, {
        headers: {
          'x-api-key': process.env.API_KEY
        }
      });

      // Cập nhật user_id trong auth
      newAuth.user_id = userResponse.data.user._id;
      await newAuth.save();
    } catch (error) {
      // Nếu tạo user thất bại, xóa auth đã tạo
      await Auth.findByIdAndDelete(newAuth._id);
      return res.status(500).json({ message: 'Lỗi tạo thông tin người dùng' });
    }

    const token = generateToken(newAuth._id);

    res.status(201).json({
      message: 'Đăng ký thành công',
      token,
      user: {
        id: newAuth._id,
        email: newAuth.email,
        isAdmin: newAuth.isAdmin
      }
    });
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Đăng nhập admin
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const auth = await Auth.findOne({ email, isActive: true });
    if (!auth) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    if (!auth.isAdmin) {
      return res.status(403).json({ message: 'Không có quyền truy cập admin' });
    }

    const isPasswordValid = await auth.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const token = generateToken(auth._id);

    res.json({
      message: 'Đăng nhập admin thành công',
      token,
      user: {
        id: auth._id,
        email: auth.email,
        isAdmin: auth.isAdmin
      }
    });
  } catch (error) {
    console.error('Lỗi đăng nhập admin:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Đăng nhập user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const auth = await Auth.findOne({ email, isActive: true });
    if (!auth) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    if (auth.isAdmin) {
      return res.status(403).json({ message: 'Tài khoản admin không thể đăng nhập ở đây' });
    }

    const isPasswordValid = await auth.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const token = generateToken(auth._id);

    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: auth._id,
        email: auth.email,
        isAdmin: auth.isAdmin,
        user_id: auth.user_id
      }
    });
  } catch (error) {
    console.error('Lỗi đăng nhập user:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Xác thực token
const verifyToken = async (req, res) => {
  try {
    const auth = await Auth.findById(req.authId).select('-password');
    if (!auth || !auth.isActive) {
      return res.status(401).json({ message: 'Token không hợp lệ' });
    }

    res.json({
      user: {
        id: auth._id,
        email: auth.email,
        isAdmin: auth.isAdmin,
        user_id: auth.user_id
      }
    });
  } catch (error) {
    console.error('Lỗi xác thực token:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = {
  register,
  loginAdmin,
  loginUser,
  verifyToken
};
