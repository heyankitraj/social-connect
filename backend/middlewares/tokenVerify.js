import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.cookies.Token;
    if (!token)
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });

    const verify = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verify.userId;
    next();
  } catch (error) {
    console.log("Token verification error: ", error.message);
    return res
      .status(401)
      .json({ message: "Invalid or expired token", error: error.message });
  }
};

export default verifyToken;
