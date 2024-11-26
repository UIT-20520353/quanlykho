import { Role } from "@prisma/client";

export interface LoginResponse {
  accessToken: string;
  role: Role;
}
