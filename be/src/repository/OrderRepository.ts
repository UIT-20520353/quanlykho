import { User } from "@prisma/client";
import { Order } from "@prisma/client";
import { OrderDetailWithProduct } from "./OrderDetailRepository";
import { db } from "../config/DbConfig";
import { PagingOptions } from "../utils/QueryType";
import { buildPaging } from "../utils/BuildPaging";

export type OrderWithDetailsAndUser = Order & {
  orderDetails: OrderDetailWithProduct[];
  user: User;
};

export class OrderRepository {
  async create(order: Omit<Order, "id">): Promise<Order> {
    return await db.order.create({ data: order });
  }
  async findById(id: number): Promise<OrderWithDetailsAndUser | null> {
    return await db.order.findUnique({
      where: { id },
      include: {
        orderDetails: {
          include: { product: true },
        },
        user: true,
      },
    });
  }
  async update(id: number, order: Omit<Order, "id">): Promise<Order> {
    return await db.order.update({ where: { id }, data: order });
  }
  async delete(id: number): Promise<void> {
    await db.order.delete({ where: { id } });
  }
  async count(): Promise<number> {
    return await db.order.count();
  }
  async findAll(page: PagingOptions): Promise<OrderWithDetailsAndUser[]> {
    return await db.order.findMany({
      ...buildPaging(page),
      include: {
        orderDetails: {
          include: { product: true },
        },
        user: true,
      },
    });
  }
}
