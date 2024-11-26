import { Prisma } from "@prisma/client";
import { ProductRepository } from "../../repository/ProductRepository";
import { ProductCriteria } from "../criteria/ProductCriteria";
import { ProductService } from "../ProductService";
import { buildFieldConditions } from "../../utils/BuildConditionField";
import {
  NumberFilter,
  PagingOptions,
  PagingResult,
} from "../../utils/QueryType";
import { ProductModel } from "../../model/Product";
import {
  CreateProductRequest,
  UpdateProductRequest,
} from "../request/ProductRequest";
import { productMapper } from "../../mapper/ProductMapper";
import { NotFoundException } from "../../exception/NotFoundException";
import { CategoryRepository } from "../../repository/CategoryRepository";
import { BadRequestException } from "../../exception/BadRequestException";

export class ProductServiceImpl implements ProductService {
  private readonly productRepository: ProductRepository;
  private readonly categoryRepository: CategoryRepository;
  constructor() {
    this.productRepository = new ProductRepository();
    this.categoryRepository = new CategoryRepository();
  }
  async updateQuantity(
    id: number,
    quantity: number,
    oldQuantity: number
  ): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException("Product not found");
    }
    const newQuantity = product.quantity + quantity - oldQuantity;
    if (newQuantity < 0) {
      throw new BadRequestException("Quantity is not enough, cannot update");
    }
    await this.productRepository.update(id, {
      quantity: newQuantity,
      name: product.name,
      price: product.price,
      cost: product.cost,
      categoryId: product.categoryId,
    });
  }

  async findById(id: number): Promise<ProductModel | null> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException("Product not found");
    }
    return productMapper.toDto(product);
  }

  async create(request: CreateProductRequest): Promise<void> {
    const category = await this.categoryRepository.findById(request.categoryId);
    if (!category) {
      throw new NotFoundException("Category not found");
    }
    const newProduct = {
      ...request,
      delete: false,
      quantity: 0,
      cost: new Prisma.Decimal(request.cost),
      price: new Prisma.Decimal(request.price),
    };
    await this.productRepository.create(newProduct);
    return;
  }

  async update(id: number, request: UpdateProductRequest): Promise<void> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    const category = await this.categoryRepository.findById(request.categoryId);
    if (!category) {
      throw new NotFoundException("Category not found");
    }

    const updatedProduct = {
      name: request.name,
      categoryId: request.categoryId,
      quantity: product.quantity,
      cost: new Prisma.Decimal(request.cost),
      price: new Prisma.Decimal(request.price),
      category: product.category,
    };
    await this.productRepository.update(id, updatedProduct);
    return;
  }

  async delete(id: number): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException("Product not found");
    }
    await this.productRepository.delete(id);
    return;
  }

  async findAll(
    page: PagingOptions,
    query: ProductCriteria
  ): Promise<PagingResult<ProductModel>> {
    const products = await this.productRepository.findAll(
      page,
      this.buildQuery(query)
    );
    const productCount = await this.productRepository.count(
      this.buildQuery(query)
    );
    return {
      data: products.map((product) => productMapper.toDto(product)),
      total: productCount,
    };
  }

  private buildQuery = (query: ProductCriteria): Prisma.ProductWhereInput => {
    const where: Prisma.ProductWhereInput = {};
    where.AND = [];

    if (query.id) {
      where.AND.push(buildFieldConditions<number>(query.id as NumberFilter));
    }
    return where;
  };
}
