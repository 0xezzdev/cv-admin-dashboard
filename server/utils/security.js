// Authentication middleware
const { verifyToken } = require('../config/auth');
const { db } = require('../config/db');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  // Get token from cookies or authorization header
  const token = req.cookies.token || 
                (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  // Verify token
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  // Check if user exists
  db.get('SELECT * FROM users WHERE id = ?', [decoded.id], (err, user) => {
    if (err || !user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Attach user to request object
    req.user = {
      id: user.id,
      username: user.username,
      email: user.email
    };
    
    next();
  });
};

module.exports = {
  isAuthenticated
};
