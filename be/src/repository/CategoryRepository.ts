import { Prisma, PrismaClient, Category } from "@prisma/client";
import { PagingOptions } from "../utils/QueryType";
import { buildPaging } from "../utils/BuildPaging";
import { db } from "../config/DbConfig";

export class CategoryRepository {
  async findAll(
    page: PagingOptions,
    where?: Prisma.CategoryWhereInput
  ): Promise<Category[]> {
    return db.category.findMany({
      where: { ...where, delete: false },
      ...buildPaging(page),
    });
  }

  async findById(id: number): Promise<Category | null> {
    return db.category.findUnique({ where: { id, delete: false } });
  }

  async create(category: Omit<Category, "id">): Promise<Category> {
    return db.category.create({ data: category });
  }

  async update(id: number, category: Omit<Category, "id">): Promise<Category> {
    return db.category.update({ where: { id }, data: category });
  }

  async delete(id: number): Promise<void> {
    await db.category.update({
      where: { id },
      data: { delete: true },
    });
  }
  async count(where?: Prisma.CategoryWhereInput): Promise<number> {
    return db.category.count({ where: { ...where, delete: false } });
  }
  async findByName(name: string): Promise<Category | null> {
    return db.category.findFirst({ where: { name, delete: false } });
  }
}
