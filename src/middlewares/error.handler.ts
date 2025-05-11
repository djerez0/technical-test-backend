import Boom from "@hapi/boom";
import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  _next,
): void => {
  console.error(`[${req.method}] ${req.originalUrl}`, err);

  if (Boom.isBoom(err)) {
    res.status(err.output.statusCode).json(err.output.payload);
    return;
  }

  if (err instanceof ZodError) {
    const boomError = Boom.badRequest("INVALID_DATA", {
      zod: err.flatten(),
    });
    res.status(boomError.output.statusCode).json(boomError.output.payload);
    return;
  }

  const boomError = Boom.internal("Error interno del servidor");
  res.status(boomError.output.statusCode).json(boomError.output.payload);
};
