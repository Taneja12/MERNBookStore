const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization denied, no token' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId); // Fetch user details from DB

    if (!user) {
      return res.status(401).json({ message: 'Authorization denied, user not found' });
    }

    // Attach user object to request
    req.user = user; 

    // Check for admin role if required
    if (req.path.startsWith('/admin') && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Authorization denied, not an admin' });
    }

    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(401).json({ message: 'Authorization denied, token invalid' });
  }
};

module.exports = authMiddleware;
