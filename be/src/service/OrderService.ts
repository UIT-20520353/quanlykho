import { PagingResult } from "../utils/QueryType";
import { OrderModel } from "../model/Order";
import { PagingOptions } from "../utils/QueryType";
import { OrderRequest } from "./request/OrderRequest";
import { OrderStatus } from "@prisma/client";

export interface OrderService {
  create(request: OrderRequest, userId: number): Promise<void>;
  findAll(page: PagingOptions): Promise<PagingResult<OrderModel>>;
  findById(id: number): Promise<OrderModel | null>;
  delete(id: number): Promise<void>;
  updateDetail(orderId: number, status: OrderStatus): Promise<void>;
}
