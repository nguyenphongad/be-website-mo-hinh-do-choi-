const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Gateway Routes sẽ được thêm sau
// app.use('/api/auth', createProxyMiddleware({ target: 'http://localhost:3001', changeOrigin: true }));
// app.use('/api/users', createProxyMiddleware({ target: 'http://localhost:3002', changeOrigin: true }));
// app.use('/api/products', createProxyMiddleware({ target: 'http://localhost:3003', changeOrigin: true }));
// app.use('/api/orders', createProxyMiddleware({ target: 'http://localhost:3004', changeOrigin: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Gateway is running', timestamp: new Date().toISOString() });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`API Gateway đang chạy trên port ${process.env.PORT || 3000}`);
});
