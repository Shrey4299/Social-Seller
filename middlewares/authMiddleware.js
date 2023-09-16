const jwt = require("jsonwebtoken");
const db = require("../models");
const Role = db.roles;

const authenticate = (role) => {
  return async (req, res, next) => {
    try {
      const bearerToken = req.header("Authorization");
      const token = bearerToken ? bearerToken.split(" ")[1] : null;

      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const AUTH_SECRET = process.env.AUTH_SECRET;
      const decoded = jwt.verify(token, AUTH_SECRET);
      req.user = decoded;

      console.log("User ID:", req.user.id);

      const userRole = await Role.findOne({
        where: {
          UserId: req.user.id,
        },
      });

      if (!userRole) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const userRoleTitle = userRole.title;

      console.log("User Role Title:", userRoleTitle);

      if (userRoleTitle === "admin" || userRoleTitle === role) {
        return next();
      }

      return res.status(403).json({ message: "Forbidden" });
    } catch (error) {
      console.error("Error:", error);
      res.status(401).json({ message: "Unauthorized" });
    }
  };
};

module.exports = authenticate;
