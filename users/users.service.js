const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('./User.model');

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

const registerUser = async (req) => {
  const { username, email, password } = req.body;

  try {
    // Response object init
    let success = true;
    let errors = [];
    let data = [];
    let token = '';

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return { 
        success: false,
        errors: ['USER_ALREADY_EXISTS'],
        data,
        token
      }
    }

    user = new User({ username, email, password });

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user
    await user.save();
    data.push(user);

    // Return jsonwebtoken
    const payload = {
      user: {
        id: user.id
      }
    }
    token = await generateToken(payload, config.get('jwtSecret'), 3600);

    return { success, errors, data, token };
  } 
  catch(err) {
    console.error(err.message);
    return {
      success: false,
      errors: ['SERVER_ERROR'],
      data,
      token
    };
  }
}

module.exports = { registerUser };