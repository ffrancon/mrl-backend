const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const service = require('./users.service');

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
  ], async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const result = await service.registerUser(req);

    if (result.success) {
      res.status(200).json(result);
    }
    else if (!result.success && result.errors.includes('SERVER_ERROR')) {
      res.status(500).json(result);
    }
    else if (!result.success && result.errors.includes('USER_ALREADY_EXISTS')) {
      res.status(400).json(result);
    }
  }
);

module.exports = router; 