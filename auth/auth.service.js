const User = require('../users/User.model');

const getUser = async req => {
  try {
    // Response object init
    let success = true;
    let errors = [];
    let data = [];

    // Get user from db
    const user = await User.findById(req.user.id);
    data.push(user);

    return { success, errors, data };
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

module.exports = { getUser };