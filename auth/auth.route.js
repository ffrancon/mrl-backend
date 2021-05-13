const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const service = require('./auth.service');

// @route  GET api/auth
// @desc   Test route
// @access public

router.get('/', auth, async (req, res) => {
  const result = await service.getUser(req);

  if (result.success) {
    res.status(200).send(result);
  }
  else if (!result.success && result.errors.includes('SERVER_ERROR')) {
    res.status(500).send(result);
  }
});

module.exports = router;