import { OrderStatus } from "@prisma/client";
import { UserModel } from "./User";

export type OrderModel = {
  id: number;
  user: UserModel;
  status: OrderStatus;
  orderDetails: OrderDetailModel[];
  createdDate: Date;
  confirmDate: Date | null;
};

export type OrderDetailModel = {
  id: number;
  orderId: number;
  totalPrice: number;
  quantity: number;
  cost: number;
  product: {
    id: number;
    name: string;
    price: number;
    cost: number;
  };
};
