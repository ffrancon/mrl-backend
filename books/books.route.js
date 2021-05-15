const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const service = require('./books.service');

// @route   POST api/books/add
// @desc    Add new book
// @access  Private
router.post('/add', [
    body('name', 'Name is required').notEmpty(),
    body('author', 'Author is required').notEmpty(),
    body('genre', 'Genre is required').notEmpty()
  ],
  auth,
  async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const result = await service.addBook(req);

    if (result.success) {
      res.status(200).json(result);
    }
    else if (!result.success && result.errors.includes('SERVER_ERROR')) {
      res.status(500).json(result);
    }
    else if (!result.success && result.errors.includes('BOOK_ALREADY_EXISTS')) {
      res.status(400).json(result);
    }
  }
);

// @route   GET api/books/get
// @desc    Get logged user's books
// @access  Private
router.get('/get', auth, async (req, res) => {
  const result = await service.getBooks(req);

  if (result.success) {
    res.status(200).json(result);
  }
  else if (!result.success && result.errors.includes('SERVER_ERROR')) {
    res.status(500).json(result);
  }
})

module.exports = router;