const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('./User.model');
const List = require('./List.model');

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
  
  // Response object init
  let success = true;
  let errors = [];
  let data = [];
  let token = '';

  try {
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
    let userCreationSuccess = true;
    await user.save()
      .then(() => {
        data.push(user);
      })
      .catch(err => {
        console.error(err);
        userCreationSuccess = false;
      });
    
    // If user creation failed, throw error
    if (!userCreationSuccess) {
      throw 'User creation failed';
    }

    // Create reading lists associated to user
    let listCreationSuccess = true;
    const lists = [
      { owner: user.id, category: 'toRead' },
      { owner: user.id, category: 'reading' },
      { owner: user.id, category: 'finished' }
    ];
    await List.insertMany(lists,{ ordered: true })
      .catch(err => {
          console.error(err);
          listCreationSuccess = false;
      });

    // If lists creation failed, remove user and throw error
    if (!listCreationSuccess) {
      await User.findOneAndDelete({ _id: user.id })
        .then(() => data = [])
        .catch(err => console.error(err));
      throw 'Lists creation failed';
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

    return { success, errors, data, token };
  } 
  catch(err) {
    console.error(err);
    return {
      success: false,
      errors: ['SERVER_ERROR'],
      data,
      token
    };
  }
}

module.exports = { registerUser };