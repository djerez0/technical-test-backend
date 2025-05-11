import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

export const validate =
  (schema: ZodSchema, tab: "body" | "params" | "query" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req[tab]);
      next();
    } catch (error: unknown) {
      res.status(400).json({
        message: "INVALID_DATA",
        issues: (error as { errors: Array<unknown> }).errors,
      });
    }
  };
