const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
        errors: ['USER_ALREADY_EXISTS']
      }
    }

    user = new User({ username, email, password });

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user
    let userCreationState = { success: true, error: ' '};
    await user.save()
      .then(() => {
        data.push(user);
      })
      .catch(err => {
        userCreationState = { success: false, error: err };
      });
    
    // If user creation failed, throw error
    if (!userCreationState) {
      throw userCreationState.error;
    }

    // Create reading lists associated to user
    let listCreationState = { success: true, erorr: '' };
    const lists = [
      { owner: user.id, category: 'toRead' },
      { owner: user.id, category: 'reading' },
      { owner: user.id, category: 'finished' }
    ];
    await List.insertMany(lists,{ ordered: true })
      .catch(err => {
          listCreationState = { success: false, error: err };
      });

    // If lists creation failed, remove user and throw error
    if (!listCreationState) {
      await User.findOneAndDelete({ _id: user.id })
        .then(() => data = [])
        .catch(err => console.error(err));
      throw listCreationState.error;
    }

    // Return jsonwebtoken
    const payload = {
      user: {
        id: user.id
      }
    }
    await generateToken(payload, process.env.JWT_SECRET, 3600)
      .then(res => token = res)
      .catch(err => console.error(err));

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

module.exports = { registerUser };