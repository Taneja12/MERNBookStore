const express = require('express');
const router = express.Router();
const Book = require('../models/Book'); // Import your Book model

// GET all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find(); // Fetch all books from MongoDB
    res.json(books); // Send books as JSON response
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
