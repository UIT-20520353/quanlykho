import { Request, Response, NextFunction } from "express";
import { AuthenException } from "../exception/AuthenException";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AccessDeniedException } from "../exception/AccessDeniedException";

export interface AuthRequest extends Request {
  user?: JwtPayload | { id: number; role: string };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new AuthenException("Unauthorized");
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) {
      throw new AuthenException("Access token is invalid");
    }

    if (!user) {
      throw new AuthenException("User not found in token");
    }

    if (typeof user === "string") {
      throw new AuthenException("Invalid token format");
    }

    req.user = user as JwtPayload | { id: number; role: string };
    next();
  });
};
export const adminMiddleware =
  (roles: string[] = ["ADMIN"]) =>
  (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return next(new AuthenException("Unauthorized"));
    }

    jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
      if (err) {
        return next(new AuthenException("Access token is invalid"));
      }

      if (!decoded || typeof decoded === "string") {
        return next(new AuthenException("Invalid token format"));
      }

      const user = decoded as JwtPayload & { id: number; role: string };

      if (!roles.includes(user.role)) {
        return next(new AccessDeniedException("Access denied"));
      }

      req.user = user;
      next();
    });
  };
