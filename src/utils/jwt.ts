import jwt from "jsonwebtoken";

import { config } from "../config/env";

export const JWT_SECRET_KEY = config.secretKey;

export const generateToken = (payload: string | Buffer | object = {}) => {
  return jwt.sign(payload, JWT_SECRET_KEY, {
    expiresIn: "1h",
  });
};
