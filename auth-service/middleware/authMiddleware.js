const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Token không được cung cấp' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.authId = decoded.authId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token không hợp lệ' });
  }
};

// Middleware kiểm tra API key cho internal services
const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.header('x-api-key');
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(403).json({ message: 'API key không hợp lệ' });
  }
  
  next();
};

module.exports = { authMiddleware, apiKeyMiddleware };
