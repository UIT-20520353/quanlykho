import { Role } from "@prisma/client";

export type UserModel = {
  id: number;
  username: string;
  role: Role;
  firstName: string;
  lastName: string;
};
