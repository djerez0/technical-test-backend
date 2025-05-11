import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 4000,
  env: process.env.NODE_ENV || "development",
  secretKey: process.env.SECRET_KEY || "secret_key",
};
