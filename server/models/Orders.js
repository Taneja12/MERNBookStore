const mongoose = require('mongoose');
const moment = require('moment'); // Only needed if you use it elsewhere

const orderSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Reference to User model
    required: true 
  },
  cartItems: [{
    bookId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Book', 
      required: true 
    },
    quantity: { 
      type: Number, 
      required: true 
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the current date and time
    required: true,
  },
  transactionId: { 
    type: String, 
    default: null 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'completed', 'failed'], // You can customize this as needed
    default: 'pending' 
  },
});

// Optionally, you can add a virtual field to format `createdAt` for output
orderSchema.virtual('formattedCreatedAt').get(function() {
  return moment(this.createdAt).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
