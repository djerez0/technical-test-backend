import boom from "@hapi/boom";
import type { NextFunction, Request, Response } from "express";

import { db } from "../db/db";

export const checkBlackList = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  await db.read();
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw boom.unauthorized("MISSING_TOKEN");
  }

  const access_token = authHeader.split(" ")[1];
  const tokenBlackList = db.data.tokenBlackList;
  if (tokenBlackList.find((token) => token.access_token === access_token)) {
    throw boom.unauthorized("REVOKED_TOKEN");
  }
  (req as unknown as { token: string }).token = access_token;

  next();
};
