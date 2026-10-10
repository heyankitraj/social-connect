import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: String,
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    headline: {
      type: String,
      default: "",
    },
    profileImage: {
      type: String,
      default: "",
    },
    coverImage: {
      type: String,
      default: "",
    },
    skills: [String,],
    education: [
      {
        college: String,
        degree: String,
      },
    ],
    location: String,
    gender: {
      type: String,
      enum: ["Male", "Female", "Others"],
    },
    experience: [
      {
        title: String,
        company: String,
        description: String,
      },
    ],
    connections: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
