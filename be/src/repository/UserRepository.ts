import { Prisma, User } from "@prisma/client";
import { PagingOptions } from "../utils/QueryType";
import { buildPaging } from "../utils/BuildPaging";
import { db } from "../config/DbConfig";

export class UserRepository {
  async findAll(
    page: PagingOptions,
    where?: Prisma.UserWhereInput
  ): Promise<User[]> {
    return db.user.findMany({
      where: { ...where, isDelete: false },
      ...buildPaging(page),
    });
  }

  async findById(id: number): Promise<User | null> {
    return db.user.findUnique({ where: { id, isDelete: false } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return db.user.findUnique({ where: { username } });
  }

  async create(user: Omit<User, "id">): Promise<User> {
    const createdUser = await db.user.create({ data: user });
    return createdUser;
  }

  async update(id: number, user: Omit<User, "id">): Promise<User> {
    const updatedUser = await db.user.update({
      where: { id },
      data: user,
    });
    return updatedUser;
  }

  async delete(id: number): Promise<void> {
    await db.user.update({ where: { id }, data: { isDelete: true } });
    return;
  }
  async count(where?: Prisma.UserWhereInput): Promise<number> {
    return await db.user.count({
      where: { ...where, isDelete: false },
    });
  }
}
