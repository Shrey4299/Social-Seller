const db = require("./index");
const User = db.users;
const generateToken = require("./authService");
const bcrypt = require("bcrypt");

exports.phoneLogin = async (req, res) => {
  console.log("entered in phoneLogin");
  const { phoneNumber } = req.body;

  try {
    const user = await User.findOne({ where: { phoneNumber: phoneNumber } });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // if (!isPasswordValid) {
    //   return res.status(401).json({ message: "Invalid credentials" });
    // }

    const token = generateToken(user);

    res.status(200).json({ message: "Login successful", token: token });
  } catch (error) {
    res.status(500).json({ message: "Server error due to sequelize" });
  }
};
