import { NextFunction, Request, Response } from "express";
import { ImportServiceImpl } from "../service/impl/ImportServiceImpl";
import { ImportService } from "../service/ImportService";
import { PagingOptions, PagingResult } from "../utils/QueryType";
import { ImportModel } from "../model/Import";
import {
  ImportDetailRequest,
  ImportRequest,
} from "../service/request/ImportRequest";
import { AuthRequest } from "../middleware/AuthMiddleware";

export class ImportController {
  importService: ImportService;
  constructor() {
    this.importService = new ImportServiceImpl();
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page: PagingOptions = {
        page: req.query.page as string,
        pageSize: req.query.pageSize as string,
      };
      const imports: PagingResult<ImportModel> =
        await this.importService.findAll(page);
      return res.status(200).json(imports);
    } catch (error) {
      next(error);
    }
  }
  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const existingImport = await this.importService.findById(id);
      return res.status(200).json(existingImport);
    } catch (error) {
      next(error);
    }
  }
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const request = req.body as ImportRequest;
      const userId = req.user?.id;
      const createdImport = await this.importService.create(request, userId);
      return res.status(200).json(createdImport);
    } catch (error) {
      next(error);
    }
  }
  async updateDetail(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const request = req.body as ImportDetailRequest;
      const updatedImport = await this.importService.update(id, request);
      return res.status(200).json(updatedImport);
    } catch (error) {
      next(error);
    }
  }
  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      await this.importService.delete(id);
      return res.status(200).json({ message: "Import deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}
