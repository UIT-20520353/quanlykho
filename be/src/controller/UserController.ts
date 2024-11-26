import { NextFunction, Request, Response } from "express";
import { UserModel } from "../model/User";
import { UserCriteria } from "../service/criteria/UserCriteris";
import { PagingOptions, PagingResult } from "../utils/QueryType";
import { UserServiceImpl } from "../service/impl/UserServiceImpl";
import { UserService } from "../service/UserService";
import { AuthRequest } from "../middleware/AuthMiddleware";

export class UserController {
  userService: UserService;
  constructor() {
    this.userService = new UserServiceImpl();
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page: PagingOptions = {
        page: req.query.page as string,
        pageSize: req.query.pageSize as string,
      };

      const query: UserCriteria = req.query || {};

      const users: PagingResult<UserModel> = await this.userService.findAll(
        page,
        query
      );
      return res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }
  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const user = await this.userService.findById(id);
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
  async findProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.findById(req.user?.id);
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      await this.userService.create(req.body);
      return res.status(200).json();
    } catch (error) {
      next(error);
    }
  }
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await this.userService.update(parseInt(id), req.body);
      return res.status(200).json();
    } catch (error) {
      next(error);
    }
  }
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await this.userService.delete(parseInt(id));
      return res.status(200).json();
    } catch (error) {
      next(error);
    }
  }
  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      await this.userService.changePassword(parseInt(req.params.id), req.body);
      return res.status(200).json();
    } catch (error) {
      next(error);
    }
  }
}
