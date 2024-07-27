const express = require('express');
const router = express.Router();
const Book = require('../models/Book'); // Import your Book model
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware'); 

// GET all books with pagination
router.get('/', async (req, res) => {
  try {
    const { page, pageSize } = req.query;
    const parsedPage = parseInt(page) || 1;
    const parsedPageSize = parseInt(pageSize) || 5; // Default to 3 items per page

    // Pagination setup
    const skip = (parsedPage - 1) * parsedPageSize;

    // Fetch all books with pagination
    const books = await Book.find()
      .skip(skip)
      .limit(parsedPageSize)
      .exec();

    // Count total documents to calculate total pages
    const count = await Book.countDocuments();
    const totalPages = Math.ceil(count / parsedPageSize);

    res.json({ books, totalPages, currentPage: parsedPage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET books by title (no pagination)
router.get('/search', async (req, res) => {
  try {
    const { title } = req.query;
    console.log(title)

    // If title query is not present, return a bad request status
    if (!title) {
      return res.status(400).json({ message: 'Title parameter is required for search' });
    }

    // Search books by title (assuming title is unique)
    const book = await Book.findOne({ title: { $regex: new RegExp(title, 'i') } });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET a specific book by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST to add a new book
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { title, author, description, price, imageUrl, category } = req.body;
    const newBook = new Book({ title, author, description, price, imageUrl, category });
    await newBook.save();
    res.status(201).json(newBook); // Send the new book as JSON response with status 201 (Created)
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
