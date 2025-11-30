const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Kết nối MongoDB thành công');
    app.listen(process.env.PORT || 3001, () => {
      console.log(`Auth Service đang chạy trên port ${process.env.PORT || 3001}`);
    });
  })
  .catch((error) => {
    console.error('Lỗi kết nối MongoDB:', error);
  });
