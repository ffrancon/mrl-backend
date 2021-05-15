const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

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

const authenticateUser = async req => {
  const { email, password } = req.body;

  try {
    // Response object init
    let success = true;
    let errors = [];
    let token = '';

    // Get user from db
    const user = await User.findOne({ email });
    if (!user) {
      return {
        success: false,
        errors: ['USER_DOESNOT_EXIST'],
        token
      }
    }

    // Check if password match with user's
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
        success: false,
        errors: ['INVALID_CREDENTIALS'],
        token
      }
    }

    // Return jsonwebtoken
    const payload = {
      user: {
        id: user.id
      }
    }
    await generateToken(payload, config.get('jwtSecret'), 3600)
      .then(res => token = res)
      .catch(err => console.error(err));

    return { success, errors, token };
  }
  catch(err) {
    console.error(err.message);
    return {
      success: false,
      errors: ['SERVER_ERROR'],
      token
    };
  }
}

module.exports = { authenticateUser };