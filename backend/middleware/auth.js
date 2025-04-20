const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'yourSuperSecretKey';

function authenticateUser(req, res, next) {
  let token = req.header('Authorization') || '';
  if (token.startsWith('Bearer ')) token = token.slice(7).trim();
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token.' });
  }
}

module.exports = { authenticateUser };
