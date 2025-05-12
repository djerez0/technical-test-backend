import "./auth/passport.config";

import cors from "cors";
import express from "express";
import passport from "passport";

import { errorHandler } from "./middlewares/error.handler";
import authRouter from "./routes/auth.routes";
import tasksRouter from "./routes/task.routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(passport.initialize());

app.use("/auth", authRouter);
app.use("/tasks", tasksRouter);
app.use((_req, res) => {
  res.status(404).json({
    error: "route not found",
  });
});

app.use(errorHandler);

export default app;
