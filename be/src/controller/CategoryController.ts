import { NextFunction, Request, Response } from "express";
import { CategoryServiceImpl } from "../service/impl/CategoryServiceImpl";
import { CategoryService } from "../service/CategoryService";
import { PagingOptions, PagingResult } from "../utils/QueryType";
import { CategoryCriteria } from "../service/criteria/CategoryCriteria";
import { CategoryModel } from "../model/Category";
import { CategoryRepository } from "../repository/CategoryRepository";
import { CategoryRequest } from "../service/request/CategoryRequest";

export class CategoryController {
  categoryService: CategoryService;
  constructor() {
    const categoryRepository = new CategoryRepository();
    this.categoryService = new CategoryServiceImpl(categoryRepository);
  }
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page: PagingOptions = {
        page: req.query.page as string,
        pageSize: req.query.pageSize as string,
      };
      const query: CategoryCriteria = req.query || {};
      const categories: PagingResult<CategoryModel> =
        await this.categoryService.findAll(page, query);
      return res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }
  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const category = await this.categoryService.findById(id);
      return res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  }
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      await this.categoryService.create(req.body as CategoryRequest);
      return res.status(200).json();
    } catch (error) {
      next(error);
    }
  }
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      await this.categoryService.update(
        parseInt(req.params.id),
        req.body as CategoryRequest
      );
      return res.status(200).json();
    } catch (error) {
      next(error);
    }
  }
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await this.categoryService.delete(parseInt(req.params.id));
      return res.status(200).json();
    } catch (error) {
      next(error);
    }
  }
}
