const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const service = require('./auth.service');

// @route  POST api/auth
// @desc   Authenticate user and get token
// @access public
router.post(
  '/',
  [ 
    body('email', 'Please enter a valid email')
    .isEmail()
    .normalizeEmail(),
    body('password', 'Password is required').exists({ checkFalsy: true }),
  ],
  async (req, res) => {
    const result = await service.authenticateUser(req);

    if (result.success) {
      // Send auth cookie
      res.cookie('mrl_token', result.token, {
        secure: process.env.ENV !== 'dev',
        httpOnly: true,
        expires: new Date(Date.now() + 900000)
      });
      res.status(200).send({ 
        success: result.success, 
        errors: result.errors, 
        data: result.data 
      });
    }
    else if (!result.success
      && result.errors.includes('USER_DOESNOT_EXIST')
      || result.errors.includes('INVALID_CREDENTIALS')) {
      res.status(400).send(result);
    }
    else if (!result.success && result.errors.includes('SERVER_ERROR')) {
      res.status(500).send(result);
    }
});

module.exports = router;