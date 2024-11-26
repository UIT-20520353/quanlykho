export type CreateProductRequest = {
  name: string;
  price: number;
  categoryId: number;
  cost: number;
};

export type UpdateProductRequest = Omit<CreateProductRequest, "quantity">;
