import { Role } from "@prisma/client";

export type CreateUserRequest = {
  username: string;
  password: string;
  role: Role;
  firstName: string;
  lastName: string;
};

export type UserUpdateRequest = Omit<
  CreateUserRequest,
  "password" | "username"
>;
export type UserLoginRequest = Omit<
  CreateUserRequest,
  "firstName" | "lastName" | "role"
>;
export type ChangePasswordRequest = {
  oldPassword: string;
  newPassword: string;
};
