const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if not token
  if (!token) {
    return res.status(401).json({
      success: false,
      errors: ['TOKEN_NOT_FOUND']
    });
  }
  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  }
  catch(err) {
    res.status(401).json({
      success: false,
      errors: ['INVALID_TOKEN']
    });
  }
}