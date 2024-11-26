import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exception/HttpException";

export const ErrorHandleMiddleware = (
  err: HttpException, // Handle general errors too
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.statusCode;
  const message = (err as HttpException).message || "Internal Server Error";

  res.status(status).json({
    status,
    message,
  });
};
