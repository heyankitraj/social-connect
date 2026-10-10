import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/token.js";

export const signUp = async (req, res) => {
  try {
    const { firstname, lastname, username, email, password } = req.body;

    const existingEmail = await User.findOne({ email });
    
    const existingUsername = await User.findOne({ username });
    
    if (existingEmail)
      return res.status(400).json({ message: "Email already exists!!" });
    
    if (existingUsername)
      return res.status(400).json({ message: "Username already exists!!" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstname,
      lastname,
      username,
      email,
      password: hashedPassword,
    });

    const token = await generateToken(user._id);
    const cookieOptions = {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENVIRONMENT === "production",
    };
    res.cookie("token", token, cookieOptions);

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(201).json(userObj);
  } catch (error) {
    console.log("Signup error: ", error);
    return res.status(400).json({ message: "Signup error❌", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User doesn't exist!!" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ message: "Credentials wrong❌" });

    const token = await generateToken(user._id);
    const cookieOptions = {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENVIRONMENT === "production",
    };
    res.cookie("token", token, cookieOptions);

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(200).json(userObj);
  } catch (error) {
    console.log("Login error: ", error);
    return res.status(400).json({ message: "Login error", error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.clearCookie("Token");
    return res.status(200).json({ message: "Logged out successfully✅" });
  } catch (error) {
    console.log("Logout error: ", error);
    return res.status(400).json({ message: "Logout error", error: error.message });
  }
};
