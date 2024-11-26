import { LoginResponse } from "../../model/Auth";
import { UserRepository } from "../../repository/UserRepository";
import { AuthService } from "../AuthService";
import { LoginRequest, RegisterRequest } from "../request/AuthRequest";
import { AuthenException } from "../../exception/AuthenException";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { BadRequestException } from "../../exception/BadRequestException";
import { User } from "@prisma/client";

dotenv.config();

export class AuthServiceImpl implements AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async login(request: LoginRequest): Promise<LoginResponse> {
    const { username, password } = request;
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new AuthenException("Username or password is incorrect");
    }
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new AuthenException("Username or password is incorrect");
    }
    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h",
      }
    );
    return {
      accessToken,
      role: user.role,
    };
  }

  async register(request: RegisterRequest): Promise<void> {
    const { username, password, firstName, lastName } = request;
    const existingUser = await this.userRepository.findByUsername(username);
    if (existingUser) {
      throw new BadRequestException("Username already exists");
    }
    const hashedPassword = this.hashPassword(password);
    const newUser: Omit<User, "id"> = {
      ...request,
      password: hashedPassword,
      isDelete: false,
      role: "USER",
    };

    await this.userRepository.create(newUser);
    return;
  }

  private hashPassword = (password: string): string => {
    return bcrypt.hashSync(password, 10);
  };
}
