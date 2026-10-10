import express from "express";
import verifyToken from "../middlewares/tokenVerify.js";
import upload from "../middlewares/multer.js";
import {
  comments,
  createPost,
  deletePost,
  getPost,
  like,
} from "../controllers/post.controllers.js";

const postRouter = express.Router();

postRouter.post("/create", verifyToken, upload.single("image"), createPost);
postRouter.get("/getpost", verifyToken, getPost);
postRouter.get("/like/:id", verifyToken, like);
postRouter.post("/comment/:id", verifyToken, comments);
postRouter.delete("/:id", verifyToken, deletePost);

export default postRouter;
