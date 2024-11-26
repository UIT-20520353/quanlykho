import { Category, Prisma, PrismaClient, Product } from "@prisma/client";
import { PagingOptions } from "../utils/QueryType";
import { buildPaging } from "../utils/BuildPaging";
import { db } from "../config/DbConfig";
import { Decimal } from "@prisma/client/runtime/library";

export class ProductRepository {
  async findAll(
    page: PagingOptions,
    where?: Prisma.ProductWhereInput
  ): Promise<
    {
      id: number;
      name: string;
      price: Decimal;
      cost: Decimal;
      category: Category;
      quantity: number;
      categoryId: number;
    }[]
  > {
    return db.product.findMany({
      where: {
        delete: false,
        ...where,
      },
      ...buildPaging(page),
      include: {
        category: true,
      },
    });
  }

  async findById(id: number): Promise<{
    id: number;
    name: string;
    price: Decimal;
    cost: Decimal;
    category: Category;
    quantity: number;
    categoryId: number;
  } | null> {
    const product = await db.product.findUnique({
      where: { id, delete: false },
      include: { category: true },
    });
    if (!product) {
      return null;
    }
    return product;
  }

  async create(product: Omit<Product, "id">): Promise<{
    id: number;
    name: string;
    price: Decimal;
    cost: Decimal;
    category: Category;
    quantity: number;
    categoryId: number;
  }> {
    return db.product.create({
      data: product,
      include: { category: true },
    });
  }

  async update(
    id: number,
    product: Omit<Product, "id" | "delete">
  ): Promise<{
    id: number;
    name: string;
    price: Decimal;
    cost: Decimal;
    category: Category;
    quantity: number;
    categoryId: number;
  }> {
    const updatedProduct = await db.product.update({
      where: { id },
      data: product,
      include: { category: true },
    });
    return updatedProduct;
  }

  async delete(id: number): Promise<void> {
    await db.product.update({ where: { id }, data: { delete: true } });
  }
  async count(where?: Prisma.ProductWhereInput): Promise<number> {
    return db.product.count({ where: { delete: false, ...where } });
  }
}
