import Post from "../models/post.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const createPost = async (req, res) => {
  try {
    const { description } = req.body;
    let image = null;

    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    let newPost = await Post.create({
      author: req.userId,
      description: description || "",
      image: image || "",
    });

    newPost = await newPost.populate(
      "author",
      "firstname lastname username email headline profileImage"
    );

    return res.status(201).json(newPost);
  } catch (error) {
    console.error("Post creation error: ", error);
    return res
      .status(500)
      .json({ message: "Post creation error", error: error.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate(
        "author",
        "firstname lastname username email headline profileImage"
      )
      .populate(
        "comments.author",
        "firstname lastname username email headline profileImage"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching post: ", error);
    return res
      .status(500)
      .json({ message: "Error fetching post", error: error.message });
  }
};

export const like = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;

    let post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found!!" });
    }

    const likeIndex = post.like.findIndex(
      (id) => id.toString() === userId.toString()
    );

    if (likeIndex === -1) {
      post.like.push(userId);
    } else {
      post.like.splice(likeIndex, 1);
    }

    await post.save();

    const updatedPost = await Post.findById(postId)
      .populate(
        "author",
        "firstname lastname username email headline profileImage"
      )
      .populate(
        "comments.author",
        "firstname lastname username email headline profileImage"
      );

    return res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Like error: ", error);
    return res
      .status(500)
      .json({ message: "Like error", error: error.message });
  }
};

export const comments = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Comment content cannot be empty" });
    }

    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { comments: { content: content.trim(), author: userId } },
      },
      { new: true }
    )
      .populate(
        "author",
        "firstname lastname username email headline profileImage"
      )
      .populate(
        "comments.author",
        "firstname lastname username email headline profileImage createdAt"
      );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json(post);
  } catch (error) {
    console.error("Comment error: ", error);
    return res
      .status(500)
      .json({ message: "Comment error", error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "You are not authorized to delete this post" });
    }

    await Post.findByIdAndDelete(postId);
    return res.status(200).json({ message: "Post deleted successfully", postId });
  } catch (error) {
    console.error("Delete post error:", error);
    return res.status(500).json({ message: "Error deleting post", error: error.message });
  }
};
