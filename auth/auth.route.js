const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const service = require('./auth.service');

// @route  POST api/auth
// @desc   Authenticate user and get token
// @access public
router.post(
  '/login',
  [ 
    body('email', 'Please enter a valid email')
    .isEmail()
    .normalizeEmail(),
    body('password', 'Password is required').exists({ checkFalsy: true }),
  ],
  async (req, res) => {
    const result = await service.authenticateUser(req);

    if (result.success) {
      res.status(200).send({ 
        success: result.success, 
        errors: result.errors,
        token: result.token,
        data: result.data 
      });
    }
    else if (!result.success
      && (result.errors.includes('USER_DOESNOT_EXIST')
      || result.errors.includes('INVALID_CREDENTIALS'))) {
      res.status(400).send(result);
    }
    else if (!result.success && result.errors.includes('SERVER_ERROR')) {
      res.status(500).send(result);
    }
});

// @route  GET api/checkjwt
// @desc   Verify jwt
// @access public
router.get('/checkjwt', auth, async (req, res) => {
  const result = await service.checkToken(req);

  res.status(200).send({
    success: result.success,
    token: result.token,
    data: result.data
  });
});

module.exports = router;