import { User } from "@prisma/client";
import { UserModel } from "../model/User";

export class UserMapper {
  toDto(user: User): UserModel {
    return {
      id: user.id,
      username: user.username,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
