import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../repository/UserRepository";
import { AuthService } from "../service/AuthService";
import { AuthServiceImpl } from "../service/impl/AuthServiceImpl";
import { LoginRequest, RegisterRequest } from "../service/request/AuthRequest";

export class AuthController {
  authService: AuthService;
  constructor() {
    const userRepository = new UserRepository();
    this.authService = new AuthServiceImpl(userRepository);
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as RegisterRequest;
      await this.authService.register(request);
      return res.status(200).json({ message: "User registered successfully" });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const request = req.body as LoginRequest;
      const response = await this.authService.login(request);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
