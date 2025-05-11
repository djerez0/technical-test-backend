import { Router } from "express";
import passport from "passport";

import { addTask, deleteTask, getTasks } from "../controllers/tasks.controller";
import { checkBlackList } from "../middlewares/check-blacklist.middleware";
import { validate } from "../middlewares/validation";
import { addTaskSchema } from "../schemas/add-task.schema";
import { deleteTaskSchema } from "../schemas/delete-task.schema";

const router = Router();

router.post(
  "/",
  validate(addTaskSchema),
  passport.authenticate("jwt", { session: false }),
  checkBlackList,
  addTask,
);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  checkBlackList,
  getTasks,
);

router.delete(
  "/:id",
  validate(deleteTaskSchema, "params"),
  passport.authenticate("jwt", { session: false }),
  checkBlackList,
  deleteTask,
);

export default router;
