const mongoose = require('mongoose');
const Auth = require('../models/Auth');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Kết nối MongoDB thành công');

    // Kiểm tra admin đã tồn tại chưa
    const existingAdmin = await Auth.findOne({ isAdmin: true });
    if (existingAdmin) {
      console.log('Admin đã tồn tại:', existingAdmin.email);
      process.exit(0);
    }

    // Tạo admin mới
    const adminData = {
      email: 'admin@toystore.com',
      password: 'admin123',
      isAdmin: true,
      isActive: true
    };

    const admin = new Auth(adminData);
    await admin.save();

    console.log('Tạo tài khoản admin thành công!');
    console.log('Email:', adminData.email);
    console.log('Password:', adminData.password);
    console.log('Vui lòng đổi mật khẩu sau khi đăng nhập lần đầu');

  } catch (error) {
    console.error('Lỗi tạo admin:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdmin();
