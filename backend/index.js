import express from "express";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import cors from "cors";
import connectionRouter from "./routes/connection.routes.js";

dotenv.config();

const port = process.env.PORT || 8000;
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or reverse proxy)
      // or allow any origin to match the EC2 IP/domain dynamically
      callback(null, true);
    },
    credentials: true,
  }),
);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/connection", connectionRouter);

app.get("/", (_, res) => {
  res.end("Server is running sucessfully");
});

app.listen(port, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${port}`);
});
