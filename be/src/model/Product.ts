import { CategoryModel } from "./Category";

export type ProductModel = {
  id: number;
  name: string;
  price: number;
  cost: number;
  quantity: number;
  categoryId: number;
  category: CategoryModel;
};
