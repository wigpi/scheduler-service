require('dotenv').config(); // Ensure to load environment variables
const ADMIN_KEY = process.env.ADMIN_KEY;

const adminKeyCheck = (req, res, next) => {
  const adminKey = req.query.admin_key;

  if (!adminKey || adminKey !== ADMIN_KEY) {
    return res.status(403).json({ message: 'Forbidden: Invalid or missing admin key.' });
  }

  next();
};

module.exports = adminKeyCheck;
