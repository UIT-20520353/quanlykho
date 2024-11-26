import { Category } from "@prisma/client";

import { CategoryModel } from "../model/Category";

export class CategoryMapper {
  toDto(category: Category): CategoryModel {
    return {
      id: category.id,
      name: category.name,
    };
  }
}
export const categoryMapper = new CategoryMapper();
