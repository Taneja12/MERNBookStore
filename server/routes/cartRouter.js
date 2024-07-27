const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Book = require('../models/Book');

// Route to add an item to the cart
router.post('/add-to-cart', async (req, res) => {
  const { userId, bookId, quantity } = req.body;
  console.log({userId, bookId, quantity});
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      // If cart does not exist for the user, create a new cart
      cart = new Cart({
        userId,
        cartItems: {}
      });
    }

    // Update or add quantity for the bookId in cartItems
    const currentQuantity = cart.cartItems.get(bookId) || 0;
    cart.cartItems.set(bookId, currentQuantity + quantity);

    await cart.save();

    res.status(201).json(cart);
  } catch (err) {
    console.error('Error adding to cart:', err);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

// Route to get cart items for a specific user
// Route to get cart items for a specific user
router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      // Create a new cart for the user if it doesn't exist
      cart = new Cart({ userId, cartItems: new Map() });
      await cart.save();
    }

    // Convert cartItems map to an array of objects with book details
    const cartItemsArray = await Promise.all(Array.from(cart.cartItems.entries()).map(async ([bookId, quantity]) => {
      const book = await Book.findById(bookId).lean();
      if (!book) {
        return null; // Handle the case where the book is not found
      }
      return {
        bookId: bookId,
        quantity: quantity,
        bookTitle: book.title,
        bookPrice: book.price,
        bookImage: book.imageUrl,
        bookAuthor: book.author,
        bookDescription: book.description,
        bookCategory: book.category
      };
    }));

    // Filter out null values in case some books are not found
    const validCartItems = cartItemsArray.filter(item => item !== null);

    res.json(validCartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
});



// Route to delete an item from the cart
router.delete('/:userId/:bookId', async (req, res) => {
  const { userId, bookId } = req.params;
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Remove the item from the cartItems map
    cart.cartItems.delete(bookId);

    // Save the updated cart
    await cart.save();

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

module.exports = router;
