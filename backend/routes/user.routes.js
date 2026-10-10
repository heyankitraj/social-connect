import express from "express";
import verifyToken from "../middlewares/tokenVerify.js";
import {
  getCurrentUser,
  getUserById,
  saveProfile,
  getSuggestedUsers,
  searchUsers,
} from "../controllers/user.controllers.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.get("/currentuser", verifyToken, getCurrentUser);
userRouter.get("/suggested", verifyToken, getSuggestedUsers);
userRouter.get("/search", verifyToken, searchUsers);
userRouter.get("/:id", verifyToken, getUserById);
userRouter.put(
  "/updateprofile",
  verifyToken,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  saveProfile
);

export default userRouter;
