const express = require('express');
const router = express.Router();
const Order = require('../models/Orders');

// POST /api/orders - Create a new order
router.post('/', async (req, res) => {
  try {
    const { sessionId, userId, cartItems } = req.body;

    const order = new Order({
      sessionId,
      userId,
      cartItems,
    });

    const savedOrder = await order.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

module.exports = router;
