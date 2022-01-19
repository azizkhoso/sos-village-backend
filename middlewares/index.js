const jwt = require('jsonwebtoken');
const StatusMessageError = require('../others/StatusMessageError');

async function verifyToken(req, res, next) {
  try {
    const { authorization } = req.headers;
    if (!authorization) throw new StatusMessageError('Unauthorized request', 401);
    // Authorization format: Bearer <token>
    const token = authorization.split(' ')[1];
    if (!token) throw new StatusMessageError('Unauthorized request', 401);
    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (user.admin) {
      req.admin = user.admin;
    } else if (user.teacher) {
      req.teacher = user.teacher;
    } else if (user.student) {
      req.student = user.student;
    } else {
      throw new StatusMessageError('Invalid token', 406);
    }
    next();
  } catch (e) {
    if (e.status) {
      res.status(e.status || 401).json({ error: e.message });
    } else if (e instanceof jwt.TokenExpiredError) {
      res.status(403).json({ error: 'Session expired, please login again' });
    } else {
      res.status(500).json({ error: e.message });
    }
  }
}

module.exports = verifyToken;
