import User from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select("-password")
      .populate("connections", "firstname lastname username profileImage headline");

    if (!user) return res.status(404).json({ message: "User not found!!" });

    return res.status(200).json(user);
  } catch (error) {
    console.error("Get current user error: ", error);
    return res
      .status(500)
      .json({ message: "Get current user error!!", error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("connections", "firstname lastname username profileImage headline");

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(user);
  } catch (error) {
    console.error("Get user by id error: ", error);
    return res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
};

export const saveProfile = async (req, res) => {
  try {
    const { firstname, lastname, username, email, headline, location, gender } =
      req.body;

    let skills = [];
    let experience = [];
    let education = [];

    try {
      if (typeof req.body.skills === "string") {
        skills = JSON.parse(req.body.skills);
      } else if (Array.isArray(req.body.skills)) {
        skills = req.body.skills;
      }
    } catch {
      skills = [];
    }

    try {
      if (typeof req.body.experience === "string") {
        experience = JSON.parse(req.body.experience);
      } else if (Array.isArray(req.body.experience)) {
        experience = req.body.experience;
      }
    } catch {
      experience = [];
    }

    try {
      if (typeof req.body.education === "string") {
        education = JSON.parse(req.body.education);
      } else if (Array.isArray(req.body.education)) {
        education = req.body.education;
      }
    } catch {
      education = [];
    }

    let profileImage;
    let coverImage;

    if (req.files?.profileImage?.[0]?.path) {
      profileImage = await uploadOnCloudinary(req.files.profileImage[0].path);
    }
    if (req.files?.coverImage?.[0]?.path) {
      coverImage = await uploadOnCloudinary(req.files.coverImage[0].path);
    }

    const updateData = {
      firstname,
      lastname,
      username,
      email,
      headline,
      skills,
      education,
      location,
      gender,
      experience,
    };
    if (profileImage) updateData.profileImage = profileImage;
    if (coverImage) updateData.coverImage = coverImage;

    const user = await User.findByIdAndUpdate(req.userId, updateData, {
      new: true,
    }).select("-password");

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error updating profile: ", error);
    return res
      .status(500)
      .json({ message: "Error in updating details", error: error.message });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    const excludeIds = [req.userId, ...(currentUser?.connections || [])];

    const suggestedUsers = await User.find({ _id: { $nin: excludeIds } })
      .select("-password")
      .limit(10);

    return res.status(200).json(suggestedUsers);
  } catch (error) {
    console.error("Suggested users error:", error);
    return res
      .status(500)
      .json({ message: "Error fetching suggestions", error: error.message });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(200).json([]);

    const regex = new RegExp(q, "i");
    const results = await User.find({
      $or: [
        { firstname: regex },
        { lastname: regex },
        { username: regex },
        { headline: regex },
        { skills: regex },
      ],
    })
      .select("firstname lastname username headline profileImage location")
      .limit(10);

    return res.status(200).json(results);
  } catch (error) {
    console.error("Search users error:", error);
    return res
      .status(500)
      .json({ message: "Search error", error: error.message });
  }
};

