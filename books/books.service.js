const mongoose = require('mongoose');
const Book = require('./Book.model');

// Add book in logged user's list
const addBook = async (req) => {
  const { name, author, genre, listId } = req.body;

  // Response object init
  let success = true;
  let errors = [];
  let data = [];

  try {
    // Check if book exists in the user's list
    let book = await Book.findOne({ name, author, owner: req.user.id });
    if (book) {
      return { 
        success: false,
        errors: ['BOOK_ALREADY_EXISTS'],
        data
      }
    }

    book = new Book({
      name,
      author,
      genre,
      owner: req.user.id,
      list: mongoose.Types.ObjectId(listId)
    });

    // Save book
    let bookCreationSuccess = true;
    await book.save()
      .then(() => {
        data.push(book);
      })
      .catch(err => {
        console.error(err);
        bookCreationSuccess = false;
      });
    
    // If book add failed, throw error
    if (!bookCreationSuccess) {
      throw 'Book add failed';
    }

    return { success, errors, data };
  }
  catch(err) {
    console.error(err);
    return {
      success: false,
      errors: ['SERVER_ERROR'],
      data
    };
  }
}

// Get logged user's books
const getBooks = async (req) => {
  try {
    // Response object init
    let success = true;
    let errors = [];
    let data = [];

    // Get book list
    const books = await Book.find({ owner: req.user.id });

    data = books;

    return { success, errors, data };
  }
  catch(err) {
    console.error(err.message);
    return {
      success: false,
      errors: ['SERVER_ERROR'],
      data
    };
  }
}

module.exports = { addBook, getBooks };