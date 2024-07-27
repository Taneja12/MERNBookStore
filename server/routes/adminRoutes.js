// server/routes/admin.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Orders');
const authMiddleware = require('../middleware/authMiddleware');

// Route to fetch all users
router.get('/users', authMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: 'userId',
        select: 'username' // Select only the username field from the User model
      })
      .populate({
        path: 'cartItems.bookId',
        select: 'title imageUrl' // Select relevant fields from the Book model
      });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;
