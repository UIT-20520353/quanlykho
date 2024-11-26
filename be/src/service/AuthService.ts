import { LoginResponse } from "../model/Auth";
import { LoginRequest, RegisterRequest } from "./request/AuthRequest";

export interface AuthService {
  login(request: LoginRequest): Promise<LoginResponse>;
  register(request: RegisterRequest): Promise<void>;
}
