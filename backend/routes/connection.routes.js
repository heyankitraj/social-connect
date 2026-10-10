import express from "express";
import verifyToken from "../middlewares/tokenVerify.js";
import {
  acceptConnection,
  getAllConnection,
  getConnectionStatus,
  getUserConnections,
  rejectConnection,
  removeConnection,
  sendConnection,
} from "../controllers/connection.controllers.js";

const connectionRouter = express.Router();

connectionRouter.post("/send/:id", verifyToken, sendConnection);
connectionRouter.post("/accept/:connectionId", verifyToken, acceptConnection);
connectionRouter.post("/reject/:connectionId", verifyToken, rejectConnection);
connectionRouter.post("/remove/:userId", verifyToken, removeConnection);
connectionRouter.get("/getstatus/:userId", verifyToken, getConnectionStatus);
connectionRouter.get("/allrequests", verifyToken, getAllConnection);
connectionRouter.get("/", verifyToken, getUserConnections);

export default connectionRouter;
