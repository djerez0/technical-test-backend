import "./auth/passport.config";

import express from "express";
import passport from "passport";

import { errorHandler } from "./middlewares/error.handler";
import authRouter from "./routes/auth.routes";
import tasksRouter from "./routes/task.routes";

const app = express();

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
