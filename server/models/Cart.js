const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cartItems: {
    type: Map,
    of: Number, // Quantity of each book
    default: {}
  }
});

module.exports = mongoose.model('Cart', cartSchema);
