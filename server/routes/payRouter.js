const express = require('express');
const router = express.Router();
const axios = require('axios');
const Order = require('../models/Orders');
const moment = require('moment');
require('dotenv').config();

// Load environment variables
const CF_API_BASE_URL = process.env.CF_API_BASE_URL;
const CF_APP_ID = process.env.CF_APP_ID;
const CF_SECRET_KEY = process.env.CF_SECRET_KEY;

// Check for missing environment variables
if (!CF_API_BASE_URL || !CF_APP_ID || !CF_SECRET_KEY) {
  throw new Error('Missing environment variables for Cashfree API.');
}

// Create Order Endpoint
router.post('/createOrder', async (req, res) => {
  try {
    const { orderId, orderAmount, customer_id, customerName, customerEmail, customerPhone } = req.body;
    const orderData = {
      customer_details: {
        customer_id,
        customer_phone: customerPhone,
        customer_email: customerEmail,
      },
      order_amount: orderAmount,
      order_currency: 'INR',
      order_id: orderId,
    };

    const response = await axios.post(CF_API_BASE_URL, orderData, {
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': CF_APP_ID,
        'x-client-secret': CF_SECRET_KEY,
        'x-api-version': '2023-08-01',
      },
    });

    const responseData = response.data;

    if (responseData.order_status === 'ACTIVE') {
      res.json({ sessionId: responseData.payment_session_id });
    } else {
      throw new Error(responseData.message || 'Unknown error');
    }
  } catch (error) {
    console.error('Error creating Cashfree order:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Allowed IP addresses for webhook
const allowedIps = {
  production: [
    '52.66.101.190',
    '3.109.102.144',
    '3.111.60.173'
  ],
  test: [
    '52.66.25.127'
  ]
};

// Dynamic environment check
const environment = process.env.NODE_ENV || 'test';
const allowedIpsCurrentEnv = allowedIps[environment] || [];

// IP Filtering Middleware
const ipFilter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const forwardedIp = req.headers['x-forwarded-for'] || ip;

  if (allowedIpsCurrentEnv.includes(forwardedIp)) {
    next();
  } else {
    res.status(403).send('Forbidden');
  }
};

// Webhook Endpoint
router.post('/webhook', ipFilter, async (req, res) => {
  const event = req.body;
  console.log('Received webhook event:', event);

  const { transactionId, orderId, paymentStatus } = event;

  if (transactionId && orderId) {
    try {
      const order = await Order.findOne({ orderId });

      if (order) {
        order.paymentStatus = paymentStatus;
        order.transactionId = transactionId;
        await order.save();

        // Notify user or take further actions as needed
        console.log('Order updated with transaction ID:', transactionId);
      } else {
        console.log('Order not found for transaction ID:', transactionId);
      }
    } catch (error) {
      console.error('Error processing webhook:', error.message);
    }
  }

  res.status(200).send('Webhook received successfully');
});

// Create New Order Endpoint
router.post('/new', async (req, res) => {
  try {
    const { sessionId, userId, cartItems } = req.body;

    const order = new Order({
      sessionId,
      userId,
      cartItems,
      createdAt: moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ'), // Set createdAt manually to current date/time
    });

    const savedOrder = await order.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error.message);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Fetch Orders for a User Endpoint
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await Order.find({ userId }).populate('cartItems.bookId');
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Handle Payment Return Endpoint
router.post('/payment-return', async (req, res) => {
  try {
    const { transactionId, orderId, paymentStatus } = req.body;

    if (!transactionId || !orderId) {
      return res.status(400).json({ error: 'Transaction ID and Order ID are required' });
    }

    const order = await Order.findOne({ orderId });

    if (order) {
      order.paymentStatus = paymentStatus;
      order.transactionId = transactionId;
      await order.save();

      res.status(200).json({ message: 'Order updated successfully' });
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    console.error('Error handling payment return:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
