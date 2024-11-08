const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the path as needed

const authMiddleware = async (req, res, next) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId);
    
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Failed to authenticate token' });
  }
};

module.exports = authMiddleware;