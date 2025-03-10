const jwt = require("jsonwebtoken");
require("dotenv").config();
const getToken = (headers) => {
  if (!headers["authorization"]) return null;
  const [type, token] = headers["authorization"].split(" ");
  return type === "Bearer" ? token : null;
};

const isAuth = async (req, res, next) => {
  const token = getToken(req.headers);
  // console.log(token, "token");
  if (!token) return res.status(401).json({ message: "permition dinied" });
  try {
    const payLoad = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payLoad.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "permition dinied" });
  }
};

module.exports = isAuth;
