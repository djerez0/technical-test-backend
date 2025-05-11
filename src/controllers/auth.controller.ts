import boom from "@hapi/boom";
import bcrypt from "bcrypt";
import type { Request, Response } from "express";

import { db, type TokenBlackList, type User } from "../db/db";
import { generateToken } from "../utils/jwt";

export const signUp = async (req: Request, res: Response) => {
  await db.read();
  const { password, username } = req.body as Omit<User, "id">;
  const users = db.data.users;
  const exist = users.find((user) => user.username === username);

  if (exist) {
    throw boom.badRequest("USERNAME_ALREADY_IN_USE");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser: User = {
    id: users.length + 1,
    username,
    password: passwordHash,
  };

  users.push(newUser);
  db.data.users = users;
  await db.write();

  const access_token = generateToken({
    username,
    sub: newUser.id,
  });

  res.status(201).json({
    access_token,
    user: { id: newUser.id, username: newUser.username },
  });
};

export const signIn = (req: Request, res: Response) => {
  const user = req.user as User;

  const access_token = generateToken({
    username: user.username,
    sub: user.id,
  });

  res.status(201).json({
    access_token,
    user: { id: user.id, username: user.username },
  });
};

export const logOut = async (req: Request, res: Response) => {
  await db.read();
  const tokenBlackList = db.data.tokenBlackList;
  const access_token = (req as unknown as { token: string }).token;

  const newTokenRevoked: TokenBlackList = {
    id: tokenBlackList.length + 1,
    access_token,
  };

  tokenBlackList.push(newTokenRevoked);
  db.data.tokenBlackList = tokenBlackList;

  await db.write();

  res.status(200).json({
    message: "LOGOUT_SUCCESSFULLY",
  });
};
