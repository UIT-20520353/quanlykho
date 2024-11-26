import { UserModel } from "../model/User";
import { PagingOptions, PagingResult } from "../utils/QueryType";
import { UserCriteria } from "./criteria/UserCriteris";
import {
  ChangePasswordRequest,
  CreateUserRequest,
  UserUpdateRequest,
} from "./request/UserRequest";
export interface UserService {
  findAll(
    page: PagingOptions,
    query: UserCriteria
  ): Promise<PagingResult<UserModel>>;
  findById(id: number): Promise<UserModel | null>;
  update(id: number, request: UserUpdateRequest): Promise<void>;
  delete(id: number): Promise<void>;
  create(request: CreateUserRequest): Promise<void>;
  changePassword(id: number, request: ChangePasswordRequest): Promise<void>;
}
