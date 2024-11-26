import { OrderDetail, Product } from "@prisma/client";
import { db } from "../config/DbConfig";
import { Decimal } from "@prisma/client/runtime/library";

export type OrderDetailWithProduct = OrderDetail & {
  product: { id: number; name: string; price: Decimal; cost: Decimal };
};

export class OrderDetailRepository {
  async create(orderDetail: Omit<OrderDetail, "id">): Promise<OrderDetail> {
    return await db.orderDetail.create({ data: orderDetail });
  }
  async findById(id: number): Promise<OrderDetailWithProduct | null> {
    return await db.orderDetail.findUnique({
      where: { id },
      include: {
        product: {
          select: { id: true, name: true, price: true, cost: true },
        },
      },
    });
  }
  async update(
    id: number,
    orderDetail: Omit<OrderDetail, "id">
  ): Promise<OrderDetail> {
    return await db.orderDetail.update({ where: { id }, data: orderDetail });
  }
  async delete(id: number): Promise<void> {
    await db.orderDetail.delete({ where: { id } });
  }
}
