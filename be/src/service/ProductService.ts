import { ProductModel } from "../model/Product";
import { PagingOptions, PagingResult } from "../utils/QueryType";
import { ProductCriteria } from "./criteria/ProductCriteria";
import {
  CreateProductRequest,
  UpdateProductRequest,
} from "./request/ProductRequest";

export interface ProductService {
  findAll(
    page: PagingOptions,
    query: ProductCriteria
  ): Promise<PagingResult<ProductModel>>;
  findById(id: number): Promise<ProductModel | null>;
  create(request: CreateProductRequest): Promise<void>;
  update(id: number, request: UpdateProductRequest): Promise<void>;
  delete(id: number): Promise<void>;
  updateQuantity(
    id: number,
    quantity: number,
    oldQuantity: number
  ): Promise<void>;
}
