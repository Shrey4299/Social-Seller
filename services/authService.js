const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const payload = {
    id: user.id,
    role: user.role

  };

  const AUTH_SECRET = process.env.AUTH_SECRET;


  return jwt.sign(payload, AUTH_SECRET, { expiresIn: "1h" });
};

module.exports = generateToken;
