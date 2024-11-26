import { Import, ImportDetail, Product, User } from "@prisma/client";
import { PagingOptions } from "../utils/QueryType";
import { db } from "../config/DbConfig";
import { buildPaging } from "../utils/BuildPaging";
import { Decimal } from "@prisma/client/runtime/library";

export type ImportWithDetailsAndUser = Import & {
  importDetails: (ImportDetail & {
    product: { id: number; name: string; price: Decimal; cost: Decimal };
  })[];
  user: User;
};

export class ImportRepository {
  async findAll(page: PagingOptions): Promise<ImportWithDetailsAndUser[]> {
    return db.import.findMany({
      ...buildPaging(page),
      include: {
        importDetails: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });
  }
  async findById(id: number): Promise<ImportWithDetailsAndUser | null> {
    return db.import.findUnique({
      where: { id },
      include: {
        importDetails: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });
  }
  async create(data: Omit<Import, "id">): Promise<Import> {
    return db.import.create({ data });
  }
  async update(id: number, data: Omit<Import, "id">): Promise<Import> {
    return db.import.update({ where: { id }, data });
  }
  async count(): Promise<number> {
    return db.import.count();
  }
  async delete(id: number): Promise<void> {
    await db.import.delete({ where: { id } });
  }
}
