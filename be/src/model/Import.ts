import { ProductModel } from "./Product";
import { UserModel } from "./User";

export type ImportModel = {
  id: number;
  userId: number;
  user: UserModel;
  createdDate: Date;
  confirmDate: Date | null;
  importDetails: ImportDetailModel[];
};

export type ImportDetailModel = {
  id: number;
  productId: number;
  importId: number;
  quantity: number;
  totalPrice: number;
  product: ProductInImport;
};
export type ProductInImport = {
  id: number;
  name: string;
  price: number;
  cost: number;
};
