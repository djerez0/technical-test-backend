import boom from "@hapi/boom";
import type { Request, Response } from "express";

import { db, type Task, type User } from "../db/db";

export const addTask = async (req: Request, res: Response) => {
  await db.read();

  const { description, title } = req.body as Omit<Task, "id" | "createdBy">;
  const tasks = db.data.tasks;

  const newTask: Task = {
    id: tasks.length + 1,
    createdBy: (req.user as User).id,
    description,
    title,
  };

  tasks.push(newTask);
  db.data.tasks = tasks;

  await db.write();

  res.status(201).json({
    task: newTask,
  });
};

export const getTasks = async (req: Request, res: Response) => {
  await db.read();

  const filterTasks = db.data.tasks.filter(
    (task) => task.createdBy === (req.user as User).id,
  );

  res.status(200).json({
    tasks: filterTasks,
  });
};

export const deleteTask = async (req: Request, res: Response) => {
  await db.read();
  const tasks = db.data.tasks;
  const { id } = req.params as { id: string };

  const exist = tasks.find((task) => task.id === Number(id));

  if (!exist) {
    throw boom.notFound("TASK_NOT_FOUND");
  }

  const newTasks = tasks.filter((task) => task.id !== Number(id));
  db.data.tasks = newTasks;

  await db.write();

  res.status(200).json({
    message: "Deleted task",
  });
};
