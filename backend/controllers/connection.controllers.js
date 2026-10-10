import { connection } from "../models/connections.model.js";
import User from "../models/user.model.js";

export const sendConnection = async (req, res) => {
  try {
    const { id } = req.params;
    const sender = req.userId;

    if (sender.toString() === id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot send request to yourself!!" });
    }

    const currentUser = await User.findById(sender);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      currentUser.connections &&
      currentUser.connections.some((c) => c.toString() === id.toString())
    ) {
      return res.status(400).json({ message: "You are already connected" });
    }

    const existingConnectionRequest = await connection.findOne({
      $or: [
        { sender, reciever: id },
        { sender: id, reciever: sender },
      ],
      status: "pending",
    });

    if (existingConnectionRequest) {
      return res.status(400).json({ message: "Connection request already pending" });
    }

    const newRequest = await connection.create({
      sender,
      reciever: id,
      status: "pending",
    });

    return res.status(200).json(newRequest);
  } catch (error) {
    console.error("Error while creating request:", error);
    return res
      .status(500)
      .json({ message: "Error while creating request", error: error.message });
  }
};

export const acceptConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const conn = await connection.findById(connectionId);

    if (!conn) {
      return res
        .status(404)
        .json({ message: "Connection doesn't exist", success: false });
    }

    if (conn.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Request already processed", success: false });
    }

    conn.status = "accepted";
    await conn.save();

    await User.findByIdAndUpdate(req.userId, {
      $addToSet: { connections: conn.sender },
    });
    await User.findByIdAndUpdate(conn.sender, {
      $addToSet: { connections: req.userId },
    });

    return res
      .status(200)
      .json({ message: "Connection accepted", success: true });
  } catch (error) {
    console.error("Error while accepting connection:", error);
    return res.status(500).json({
      message: `Error while accepting the connection: ${error.message}`,
      success: false,
    });
  }
};

export const rejectConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const conn = await connection.findById(connectionId);

    if (!conn) {
      return res
        .status(404)
        .json({ message: "Connection doesn't exist", success: false });
    }

    if (conn.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Request already processed", success: false });
    }

    conn.status = "rejected";
    await conn.save();

    return res
      .status(200)
      .json({ message: "Connection rejected", success: true });
  } catch (error) {
    console.error("Error while rejecting connection:", error);
    return res.status(500).json({
      message: `Error while rejecting the connection: ${error.message}`,
      success: false,
    });
  }
};

export const getConnectionStatus = async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.userId;

    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      currentUser.connections &&
      currentUser.connections.some(
        (c) => c.toString() === targetUserId.toString()
      )
    ) {
      return res.json({ status: "Disconnect" });
    }

    const pendingConnection = await connection.findOne({
      $or: [
        { sender: currentUserId, reciever: targetUserId },
        { sender: targetUserId, reciever: currentUserId },
      ],
      status: "pending",
    });

    if (pendingConnection) {
      if (pendingConnection.sender.toString() === currentUserId.toString()) {
        return res.json({ status: "Pending" });
      } else {
        return res.json({
          status: "Recieved",
          requestId: pendingConnection._id,
        });
      }
    }

    return res.json({ status: "Connect" });
  } catch (error) {
    console.error("Error getting connection status:", error);
    return res
      .status(500)
      .json({ message: "Error while getting Connection status" });
  }
};

export const removeConnection = async (req, res) => {
  try {
    const myId = req.userId;
    const targetUserId = req.params.userId;

    await User.findByIdAndUpdate(myId, {
      $pull: { connections: targetUserId },
    });
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { connections: myId },
    });

    // Also remove connection record if exists
    await connection.deleteMany({
      $or: [
        { sender: myId, reciever: targetUserId },
        { sender: targetUserId, reciever: myId },
      ],
    });

    return res.json({ message: "Connection removed successfully" });
  } catch (error) {
    console.error("Error removing connection:", error);
    return res
      .status(500)
      .json({ message: "Error while removing Connection" });
  }
};

export const getAllConnection = async (req, res) => {
  try {
    const myId = req.userId;

    const requests = await connection
      .find({ reciever: myId, status: "pending" })
      .populate(
        "sender",
        "firstname lastname email username profileImage headline"
      );

    return res.status(200).json(requests);
  } catch (error) {
    console.error("Error getting connection requests:", error);
    return res
      .status(500)
      .json({ message: "Error while getting all Connection requests" });
  }
};

export const getUserConnections = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).populate(
      "connections",
      "firstname lastname email username profileImage headline connections"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user.connections || []);
  } catch (error) {
    console.error("Error getting user connections:", error);
    return res.status(500).json({
      message: "Error while getting User Connection requests",
      error: error.message,
    });
  }
};
