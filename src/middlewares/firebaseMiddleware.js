const admin = require("../../config/firebaseConfig");

const decodeToken = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
      const decodeValue = await admin.auth().verifyIdToken(token);
      console.log(decodeToken)
    if (decodeValue) {
      req.user = decodeValue;
      return next();
    }
    return res.json({ message: "Unauthorize" });
  } catch (e) {
    console.log("stucked in firebase middleware");
    return res.json({ message: "Internal Error" });
  }
};

module.exports = decodeToken;


