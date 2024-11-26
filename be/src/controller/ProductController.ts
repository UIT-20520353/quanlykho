import { NextFunction, Request, Response } from "express";
import { ProductServiceImpl } from "../service/impl/ProductServiceImpl";
import { ProductService } from "../service/ProductService";
import { PagingOptions, PagingResult } from "../utils/QueryType";
import { ProductCriteria } from "../service/criteria/ProductCriteria";
import { ProductModel } from "../model/Product";
import { CreateProductRequest } from "../service/request/ProductRequest";

export class ProductController {
  productService: ProductService;
  constructor() {
    this.productService = new ProductServiceImpl();
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page: PagingOptions = {
        page: req.query.page as string,
        pageSize: req.query.pageSize as string,
      };
      const query: ProductCriteria = req.query || {};
      const products: PagingResult<ProductModel> =
        await this.productService.findAll(page, query);
      return res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const product = await this.productService.findById(id);
      return res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      await this.productService.create(req.body as CreateProductRequest);
      return res.status(200).json();
    } catch (error) {
      next(error);
    }
  }
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      await this.productService.update(
        parseInt(req.params.id),
        req.body as CreateProductRequest
      );
      return res.status(200).json();
    } catch (error) {
      next(error);
    }
  }
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await this.productService.delete(parseInt(req.params.id));
      return res.status(200).json();
    } catch (error) {
      next(error);
    }
  }
}
