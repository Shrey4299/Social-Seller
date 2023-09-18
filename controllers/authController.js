const db = require("../models");
const User = db.users;
const generateToken = require("../services/authService");
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.status(200).json({ message: "Login successful", token: token });
  } catch (error) {
    res.status(500).json({ message: "Server error due to sequelize" });
  }
};
