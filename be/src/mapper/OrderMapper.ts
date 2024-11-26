import { OrderWithDetailsAndUser } from "../repository/OrderRepository";
import { OrderDetailModel, OrderModel } from "../model/Order";
import { UserMapper } from "./UserMapper";
import { OrderDetailWithProduct } from "../repository/OrderDetailRepository";

export class OrderMapper {
  userMapper = new UserMapper();
  toDto(existingOrder: OrderWithDetailsAndUser): OrderModel {
    return {
      id: existingOrder.id,
      user: this.userMapper.toDto(existingOrder.user),
      createdDate: existingOrder.createdDate,
      confirmDate: existingOrder.confirmDate,
      status: existingOrder.status,
      orderDetails: existingOrder.orderDetails.map((detail) =>
        this.toDetailDto({
          ...detail,
          product: detail.product,
        })
      ),
    };
  }
  toDetailDto(existingOrderDetail: OrderDetailWithProduct): OrderDetailModel {
    return {
      id: existingOrderDetail.id,
      orderId: existingOrderDetail.orderId,
      totalPrice: existingOrderDetail.totalPrice.toNumber(),
      quantity: existingOrderDetail.quantity,
      cost: existingOrderDetail.cost.toNumber(),
      product: {
        id: existingOrderDetail.product.id,
        name: existingOrderDetail.product.name,
        price: existingOrderDetail.product.price.toNumber(),
        cost: existingOrderDetail.product.cost.toNumber(),
      },
    };
  }
}
