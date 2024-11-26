import { ImportDetail } from "@prisma/client";
import { db } from "../config/DbConfig";

export class ImportDetailRepository {
  async create(importDetail: Omit<ImportDetail, "id">): Promise<ImportDetail> {
    return await db.importDetail.create({ data: importDetail });
  }
  async findById(id: number): Promise<ImportDetail | null> {
    return await db.importDetail.findUnique({ where: { id } });
  }
  async update(
    id: number,
    importDetail: Omit<ImportDetail, "id">
  ): Promise<ImportDetail> {
    return await db.importDetail.update({ where: { id }, data: importDetail });
  }
  async delete(id: number): Promise<void> {
    await db.importDetail.delete({ where: { id } });
  }
}
