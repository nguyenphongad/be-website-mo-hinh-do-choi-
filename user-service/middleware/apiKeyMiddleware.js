const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.header('x-api-key');
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(403).json({ message: 'API key không hợp lệ' });
  }
  
  next();
};

module.exports = apiKeyMiddleware;
