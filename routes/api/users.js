const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator/check');

// @route   GET api/users
// @desc    Register user
// @access  Public
router.post('/', [
  body('username', 'Name is required')
    .not()
    .isEmpty(),
  body('email', 'Please enter a valid email')
    .isEmail()
    .normalizeEmail(),
  body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  res.send('User registration');
});

module.exports = router;