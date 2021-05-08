const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { body, validationResult } = require('express-validator');

const User = require('../../models/User');

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

    const { username, email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ errors: [{ msg: 'user already exists' }] });
      }

      user = new User({ username, email, password });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Save user
      await user.save();

      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id
        }
      }
      jwt.sign(
          payload,
          config.get('jwtSecret'),
          { expiresIn: 3600 },
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
    } catch(err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router; 