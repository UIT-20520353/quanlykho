import { Prisma, User } from "@prisma/client";
import { UserModel } from "../../model/User";
import { UserRepository } from "../../repository/UserRepository";
import {
  NumberFilter,
  PagingOptions,
  PagingResult,
  StringFilter,
} from "../../utils/QueryType";
import { UserCriteria } from "../criteria/UserCriteris";
import { buildFieldConditions } from "../../utils/BuildConditionField";
import { UserMapper } from "../../mapper/UserMapper";
import {
  ChangePasswordRequest,
  CreateUserRequest,
  UserUpdateRequest,
} from "../request/UserRequest";
import { NotFoundException } from "../../exception/NotFoundException";
import { BadRequestException } from "../../exception/BadRequestException";
import bcrypt from "bcrypt";
import { UserService } from "../UserService";

export class UserServiceImpl implements UserService {
  private readonly userRepository: UserRepository;
  private readonly userMapper: UserMapper;
  constructor() {
    this.userRepository = new UserRepository();
    this.userMapper = new UserMapper();
  }

  async findAll(
    page: PagingOptions,
    query: UserCriteria
  ): Promise<PagingResult<UserModel>> {
    const users = await this.userRepository.findAll(
      page,
      this.buildQuery(query)
    );
    const userCount = await this.userRepository.count(this.buildQuery(query));
    return {
      data: users.map((user) => this.userMapper.toDto(user)),
      total: userCount,
    };
  }

  async findById(id: number): Promise<UserModel> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return this.userMapper.toDto(user);
  }

  async update(id: number, request: UserUpdateRequest): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    user.firstName = request.firstName;
    user.lastName = request.lastName;
    user.role = request.role;
    await this.userRepository.update(id, user);
    return;
  }

  async delete(id: number): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    await this.userRepository.delete(id);
    return;
  }

  async create(request: CreateUserRequest): Promise<void> {
    const existingUser = await this.userRepository.findByUsername(
      request.username
    );
    if (existingUser) {
      throw new BadRequestException("Username already exists");
    }
    const hashedPassword = this.hashPassword(request.password);

    const newUser: Omit<User, "id"> = {
      ...request,
      password: hashedPassword,
      isDelete: false,
    };

    await this.userRepository.create(newUser);
    return;
  }

  async changePassword(
    id: number,
    request: ChangePasswordRequest
  ): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    const isMatch = bcrypt.compareSync(request.oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException("Old password is incorrect");
    }
    user.password = this.hashPassword(request.newPassword);
    await this.userRepository.update(id, user);
    return;
  }

  private buildQuery = (query: UserCriteria): Prisma.UserWhereInput => {
    const where: Prisma.UserWhereInput = {};
    where.AND = [];

    if (query.username) {
      where.AND.push(
        buildFieldConditions<string>(query.username as StringFilter)
      );
    }

    if (query.name) {
      const customWhere: Prisma.UserWhereInput = {};
      customWhere.OR = [
        buildFieldConditions<string>(query.name as StringFilter),
        buildFieldConditions<string>(query.name as StringFilter),
      ];
      where.AND.push(customWhere);
    }

    if (query.userId) {
      where.AND.push(
        buildFieldConditions<number>(query.userId as NumberFilter)
      );
    }

    if (query.role) {
      where.AND.push(buildFieldConditions<string>(query.role as StringFilter));
    }

    return where;
  };

  private hashPassword = (password: string): string => {
    return bcrypt.hashSync(password, 10);
  };
}
