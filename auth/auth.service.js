const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../users/User.model');

const generateToken = (payload, secret, expiresIn) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      secret,
      { expiresIn },
      (err, token) => {
        if (err) reject(err);
        else resolve(token);
      }
    );
  });
}

const checkToken = async req => {
  // Get token from header
  const token = req.header('x-auth-token');

  return {
    success: true,
    token: token,
    data: [{ userId: req.user.id }]
  }
}

const authenticateUser = async req => {
  const { email, password } = req.body;

  // Response object init
  let success = true;
  let errors = [];
  let token = '';
  let data = [];

  try {
    // Get user from db
    const user = await User.findOne({ email });
    if (!user) {
      return {
        success: false,
        errors: ['USER_DOESNOT_EXIST']
      }
    }

    // Check if password match with user's
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
        success: false,
        errors: ['INVALID_CREDENTIALS']
      }
    }

    data.push({ userId: user.id });

    // Return jsonwebtoken
    let tokenCreationState = { success: true, error: '' };
    const payload = {
      user: {
        id: user.id
      }
    }
    await generateToken(payload, process.env.JWT_SECRET, 3600)
      .then(res => token = res)
      .catch(err =>  {
        tokenCreationState = { success: false, error: err };
      });

    // If token generation failed, throw error
    if (!tokenCreationState.success) {
      throw tokenCreationState.error;
    }

    return { success, errors, data, token };
  }
  catch(err) {
    console.error(err);
    return {
      success: false,
      errors: ['SERVER_ERROR']
    };
  }
}

module.exports = { authenticateUser, checkToken };