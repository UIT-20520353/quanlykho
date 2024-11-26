import { NextFunction, Request, Response } from "express";
import { PagingOptions, PagingResult } from "../utils/QueryType";
import { OrderService } from "../service/OrderService";
import { OrderServiceImpl } from "../service/impl/OrderServiceImple";
import { OrderModel } from "../model/Order";
import { OrderRequest } from "../service/request/OrderRequest";
import { AuthRequest } from "../middleware/AuthMiddleware";
import { OrderDetailRequest } from "../service/request/OrderRequest";
import { OrderStatus } from "@prisma/client";

export class OrderController {
  orderService: OrderService;
  constructor() {
    this.orderService = new OrderServiceImpl();
  }
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page: PagingOptions = {
        page: req.query.page as string,
        pageSize: req.query.pageSize as string,
      };

      const orders: PagingResult<OrderModel> = await this.orderService.findAll(
        page
      );
      return res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }
  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const order = await this.orderService.findById(id);
      return res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  }
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const request = req.body as OrderRequest;
      const userId = req.user?.id;
      await this.orderService.create(request, userId);
      return res.status(200).json();
    } catch (error) {
      next(error);
    }
  }
  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      await this.orderService.delete(id);
      return res.status(200).json();
    } catch (error) {
      next(error);
    }
  }
  async updateStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const orderId = parseInt(req.params.id);
      const status = req.body.status as OrderStatus;
      await this.orderService.updateDetail(orderId, status);
      return res.status(200).json();
    } catch (error) {
      next(error);
    }
  }
}
