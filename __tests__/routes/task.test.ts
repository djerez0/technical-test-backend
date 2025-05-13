import "../../src/auth/passport.config";

import express from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import request from "supertest";

import {
  addTask,
  deleteTask,
  getTasks,
} from "../../src/controllers/tasks.controller";
import { db, initDB } from "../../src/db/db";
import { checkBlackList } from "../../src/middlewares/check-blacklist.middleware";
import { errorHandler } from "../../src/middlewares/error.handler";
import { validate } from "../../src/middlewares/validation";
import { addTaskSchema } from "../../src/schemas/add-task.schema";
import { deleteTaskSchema } from "../../src/schemas/delete-task.schema";
import { JWT_SECRET_KEY } from "../../src/utils/jwt";

const TEST_USER = {
  id: "9b2c6d60-91a5-4d95-8d7e-24a5ed6e9b91",
  username: "testUser2",
  password: "$2b$10$ib3eXz6x4Qpq3nC.JKXIFu2eXmzsIvGVbe667VjGeGPpAcOxmKYde",
};
const token = jwt.sign(
  { sub: TEST_USER.id, username: TEST_USER.username },
  JWT_SECRET_KEY,
);

const app = express();

app.use(express.json());
app.use(passport.initialize());

app.post(
  "/",
  validate(addTaskSchema),
  passport.authenticate("jwt", { session: false }),
  checkBlackList,
  addTask,
);

app.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  checkBlackList,
  getTasks,
);

app.delete(
  "/:id",
  validate(deleteTaskSchema, "params"),
  passport.authenticate("jwt", { session: false }),
  checkBlackList,
  deleteTask,
);

app.use(errorHandler);

describe("Tasks API", () => {
  beforeEach(async () => {
    await initDB();
    db.data.users = [TEST_USER];
    db.data.tasks = [];
    db.data.tokenBlackList = [];
    await db.write();
  });

  describe("POST /", () => {
    it("should create a new task", async () => {
      const newTask = { title: "Test Task", description: "Some description" };

      const response = await request(app)
        .post("/")
        .set("Authorization", `Bearer ${token}`)
        .send(newTask);

      expect(response.status).toBe(201);
      expect(response.body.task).toHaveProperty("id");
      expect(response.body.task.title).toBe(newTask.title);
      expect(response.body.task.description).toBe(newTask.description);
    });

    it("should fail if schema is not valid", async () => {
      const badTask = { title: "" };

      const response = await request(app)
        .post("/")
        .set("Authorization", `Bearer ${token}`)
        .send(badTask);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain("INVALID_DATA");
    });
  });

  describe("GET /", () => {
    it("should return all tasks of the user", async () => {
      db.data.tasks.push({
        id: "76f1fbd2-e09e-4a3b-84b7-7dd9fdee6cb5",
        title: "Existing Task",
        description: "Previously added",
        createdBy: TEST_USER.id,
      });

      await db.write();

      const response = await request(app)
        .get("/")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.tasks).toHaveLength(1);
      expect(response.body.tasks[0].title).toBe("Existing Task");
    });
  });

  describe("DELETE /:id", () => {
    it("should delete a task successfully", async () => {
      db.data.tasks.push({
        id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        title: "Task to delete",
        description: "To be removed",
        createdBy: TEST_USER.id,
      });

      await db.write();

      const response = await request(app)
        .delete("/3fa85f64-5717-4562-b3fc-2c963f66afa6")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Deleted task");
      expect(db.data.tasks).toHaveLength(0);
    });

    it("should return 404 if task not found", async () => {
      const response = await request(app)
        .delete("/999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("TASK_NOT_FOUND");
    });
  });
});
