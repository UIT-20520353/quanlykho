import { OrderStatus } from "@prisma/client";
import { ImportModel } from "../model/Import";
import { PagingOptions, PagingResult } from "../utils/QueryType";
import { ImportDetailRequest, ImportRequest } from "./request/ImportRequest";

export interface ImportService {
  create(request: ImportRequest, userId: number): Promise<void>;
  findById(id: number): Promise<ImportModel | null>;
  findAll(page: PagingOptions): Promise<PagingResult<ImportModel>>;
  update(id: number, request: ImportDetailRequest): Promise<void>;
  delete(id: number): Promise<void>;
}
