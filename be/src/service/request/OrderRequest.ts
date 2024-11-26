export type OrderDetailRequest = {
  productId: number;
  quantity: number;
};
export type OrderRequest = {
  orderDetails: OrderDetailRequest[];
};
