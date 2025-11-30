const mongoose = require('mongoose');
const readline = require('readline');
const axios = require('axios');
require('dotenv').config();

// Import model Auth
const Auth = require('./models/Auth');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
};

const createAdmin = async () => {
  try {
    // Kết nối MongoDB
    const mongoUri = process.env.MONGODB_URI;
    await mongoose.connect(mongoUri);
    console.log('Đã kết nối MongoDB');

    console.log('=== TẠO TÀI KHOẢN ADMIN ===');
    
    // Nhập thông tin admin
    const email = await question('Nhập email admin: ');
    const password = await question('Nhập mật khẩu admin: ');
    const fullName = await question('Nhập họ tên admin: ');
    const phone = await question('Nhập số điện thoại admin: ');
    
    // Kiểm tra email đã tồn tại chưa
    const existingAuth = await Auth.findOne({ email });
    if (existingAuth) {
      console.log('Email này đã tồn tại!');
      process.exit(1);
    }

    // Tạo tài khoản admin mới
    const adminAuth = new Auth({
      email: email,
      password: password,
      isAdmin: true,
      googleId: null,
      isActive: true,
      user_id: null
    });

    await adminAuth.save();

    // Gọi API user-service để tạo thông tin user cho admin
    try {
      const userResponse = await axios.post(`${process.env.USER_SERVICE_URL}/api/users/create`, {
        auth_id: adminAuth._id,
        fullName,
        phone,
        image: 'https://i.ibb.co/1ftbcwZ7/man.png',
        address: null
      }, {
        headers: {
          'x-api-key': process.env.API_KEY
        }
      });

      // Cập nhật user_id trong auth
      adminAuth.user_id = userResponse.data.user._id;
      await adminAuth.save();
      
      console.log('Tạo tài khoản admin thành công!');
      console.log(`Email: ${email}`);
      console.log(`Họ tên: ${fullName}`);
      console.log(`Điện thoại: ${phone}`);
      console.log(`Admin: ${adminAuth.isAdmin}`);
    } catch (error) {
      // Nếu tạo user thất bại, xóa auth đã tạo
      await Auth.findByIdAndDelete(adminAuth._id);
      console.log('Lỗi tạo thông tin người dùng admin:', error.message);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('Lỗi:', error.message);
  } finally {
    rl.close();
    mongoose.connection.close();
    process.exit(0);
  }
};

createAdmin();
