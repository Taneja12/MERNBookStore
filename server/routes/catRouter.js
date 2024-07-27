// catRouter.js

const express = require('express');
const router = express.Router();
const Book = require('../models/Book'); // Assuming you have a Book model

// Route to fetch books by category
router.get('/:category', async (req, res) => {
  const { category } = req.params;
  try {
    let books;
    if (category) {
      books = await Book.find({ category: category }).exec();
    } else {
      books = await Book.find().exec();
    }
    res.json(books);
  } catch (error) {
    console.error('Error fetching books by category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
