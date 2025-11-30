const User = require('../models/User');

// Tạo user (được gọi từ auth-service)
const createUser = async (req, res) => {
  try {
    const { auth_id, fullName, phone, image } = req.body;

    const newUser = new User({
      auth_id,
      fullName,
      phone,
      image: image || 'https://i.ibb.co/1ftbcwZ7/man.png'
    });

    await newUser.save();

    res.status(201).json({
      message: 'Tạo thông tin user thành công',
      user: newUser
    });
  } catch (error) {
    console.error('Lỗi tạo user:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy thông tin user theo auth_id
const getUserByAuthId = async (req, res) => {
  try {
    const { auth_id } = req.params;
    
    const user = await User.findOne({ auth_id });
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin user' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Lỗi lấy thông tin user:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Cập nhật thông tin user
const updateUser = async (req, res) => {
  try {
    const { auth_id } = req.params;
    const { fullName, phone, image, address } = req.body;

    const user = await User.findOneAndUpdate(
      { auth_id },
      { fullName, phone, image, address },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy user' });
    }

    res.json({
      message: 'Cập nhật thông tin thành công',
      user
    });
  } catch (error) {
    console.error('Lỗi cập nhật user:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = {
  createUser,
  getUserByAuthId,
  updateUser
};
