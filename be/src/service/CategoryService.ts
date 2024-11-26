import { PagingOptions, PagingResult } from "../utils/QueryType";
import { CategoryCriteria } from "./criteria/CategoryCriteria";
import { CategoryRequest } from "./request/CategoryRequest";
import { CategoryModel } from "../model/Category";

export interface CategoryService {
  findAll(
    page: PagingOptions,
    query: CategoryCriteria
  ): Promise<PagingResult<CategoryModel>>;
  findById(id: number): Promise<CategoryModel | null>;
  create(request: CategoryRequest): Promise<void>;
  update(id: number, request: CategoryRequest): Promise<void>;
  delete(id: number): Promise<void>;
}
