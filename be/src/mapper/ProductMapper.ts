import { Category, Product } from "@prisma/client";

import { ProductModel } from "../model/Product";
import { categoryMapper, CategoryMapper } from "./CategoryMapper";
import { Decimal } from "@prisma/client/runtime/library";

export class ProductMapper {
  constructor(private categoryMapper: CategoryMapper) {}

  toDto(product: {
    id: number;
    name: string;
    price: Decimal;
    cost: Decimal;
    category: Category;
    quantity: number;
    categoryId: number;
  }): ProductModel {
    return {
      id: product.id,
      name: product.name,
      price: product.price.toNumber(),
      cost: product.cost.toNumber(),
      category: this.categoryMapper.toDto(product.category),
      quantity: product.quantity,
      categoryId: product.categoryId,
    };
  }
}
export const productMapper = new ProductMapper(categoryMapper);
