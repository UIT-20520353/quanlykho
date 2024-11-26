import { Decimal } from "@prisma/client/runtime/library";
import { NotFoundException } from "../../exception/NotFoundException";
import { ImportModel } from "../../model/Import";
import { ImportDetailRepository } from "../../repository/ImportDetailRepository";
import { ImportRepository } from "../../repository/ImportRepository";
import { PagingOptions, PagingResult } from "../../utils/QueryType";
import { ImportService } from "../ImportService";
import { ProductService } from "../ProductService";
import { ImportDetailRequest, ImportRequest } from "../request/ImportRequest";
import { UserService } from "../UserService";
import { ImportMapper } from "../../mapper/ImportMapper";
import { UserServiceImpl } from "./UserServiceImpl";
import { ProductServiceImpl } from "./ProductServiceImpl";

export class ImportServiceImpl implements ImportService {
  private readonly importRepository: ImportRepository;
  private readonly importDetailRepository: ImportDetailRepository;
  private readonly userService: UserService;
  private readonly productService: ProductService;
  private readonly importMapper: ImportMapper;
  constructor() {
    this.importRepository = new ImportRepository();
    this.importDetailRepository = new ImportDetailRepository();
    this.userService = new UserServiceImpl();
    this.productService = new ProductServiceImpl();
    this.importMapper = new ImportMapper();
  }
  async update(id: number, request: ImportDetailRequest): Promise<void> {
    const importDetail = await this.importDetailRepository.findById(id);
    if (!importDetail) {
      throw new NotFoundException("Import detail not found");
    }
    const oldQuantity = importDetail.quantity;
    const product = await this.productService.findById(request.productId);
    if (!product) {
      throw new NotFoundException("Product not found");
    }
    await this.productService.updateQuantity(
      request.productId,
      request.quantity,
      oldQuantity
    );
    await this.importDetailRepository.update(id, {
      quantity: request.quantity,
      totalPrice: new Decimal(request.quantity).mul(product.cost),
      productId: request.productId,
      importId: importDetail.importId,
    });
    return;
  }
  async findById(id: number): Promise<ImportModel | null> {
    const existingImport = await this.importRepository.findById(id);
    if (!existingImport) {
      return null;
    }
    return this.importMapper.toDto(existingImport);
  }
  async findAll(page: PagingOptions): Promise<PagingResult<ImportModel>> {
    const imports = await this.importRepository.findAll(page);
    const data = imports.map((imp) => this.importMapper.toDto(imp));
    return {
      data,
      total: imports.length,
    };
  }
  async delete(id: number): Promise<void> {
    const existingImport = await this.importRepository.findById(id);
    if (!existingImport) {
      throw new NotFoundException("Import not found");
    }
    await Promise.all(
      existingImport.importDetails.map(async (detail) => {
        await this.productService.updateQuantity(
          detail.productId,
          -detail.quantity,
          0
        );
        await this.importDetailRepository.delete(detail.id);
      })
    );
    await this.importRepository.delete(id);
    return;
  }

  async create(request: ImportRequest, userId: number): Promise<void> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    const newImport = await this.importRepository.create({
      userId: userId,
      createdDate: new Date(),
      confirmDate: null,
    });
    await Promise.all(
      request.importDetails.map(async (detail) => {
        const product = await this.productService.findById(detail.productId);
        if (!product) {
          throw new NotFoundException("Product not found");
        }
        const newImportDetail = {
          productId: product.id,
          quantity: detail.quantity,
          totalPrice: new Decimal(detail.quantity).mul(product.cost),
          importId: newImport.id,
        };
        await this.productService.updateQuantity(
          product.id,
          detail.quantity,
          0
        );
        await this.importDetailRepository.create(newImportDetail);
      })
    );
    return;
  }
}
