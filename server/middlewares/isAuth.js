import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Token not found" }); // 401 = unauthorized
    }

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verifyToken.userId;

    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({ message: "Invalid or expired token" }); // 403 = forbidden
  }
};

export default isAuth;
