const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Import your auth middleware
const User = require('../models/User'); // Import your User model

// Route: GET /api/user
// Fetch user details using authenticated token
router.get('/user', authMiddleware, async (req, res) => {
  try {
    // User object is attached to req object by authMiddleware
    res.json(req.user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
