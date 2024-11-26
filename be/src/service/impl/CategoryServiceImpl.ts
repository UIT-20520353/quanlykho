import { CategoryService } from "../CategoryService";
import { Prisma } from "@prisma/client";
import {
  NumberFilter,
  PagingOptions,
  PagingResult,
} from "../../utils/QueryType";
import { CategoryCriteria } from "../criteria/CategoryCriteria";
import { CategoryRequest } from "../request/CategoryRequest";
import { CategoryRepository } from "../../repository/CategoryRepository";
import { categoryMapper, CategoryMapper } from "../../mapper/CategoryMapper";
import { NotFoundException } from "../../exception/NotFoundException";
import { CategoryModel } from "../../model/Category";
import { ProductCriteria } from "../criteria/ProductCriteria";
import { buildFieldConditions } from "../../utils/BuildConditionField";
import { BadRequestException } from "../../exception/BadRequestException";

export class CategoryServiceImpl implements CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async findAll(
    page: PagingOptions,
    query: CategoryCriteria
  ): Promise<PagingResult<CategoryModel>> {
    const categories = await this.categoryRepository.findAll(
      page,
      this.buildQuery(query)
    );
    const categoryCount = await this.categoryRepository.count(
      this.buildQuery(query)
    );
    return {
      data: categories.map((category) => categoryMapper.toDto(category)),
      total: categoryCount,
    };
  }
  async findById(id: number): Promise<CategoryModel | null> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException("Category not found");
    }
    return categoryMapper.toDto(category);
  }
  async create(request: CategoryRequest): Promise<void> {
    const existingCategory = await this.categoryRepository.findByName(
      request.name
    );
    if (existingCategory) {
      throw new BadRequestException("Category already exists");
    }
    const newCategory = {
      name: request.name,
      delete: false,
    };
    await this.categoryRepository.create(newCategory);
    return;
  }
  async update(id: number, request: CategoryRequest): Promise<void> {
    const existingCategory = await this.categoryRepository.findByName(
      request.name
    );
    if (existingCategory && existingCategory.id !== id) {
      throw new BadRequestException("Category already exists");
    }
    const updatedCategory = {
      name: request.name,
      delete: false,
    };
    await this.categoryRepository.update(id, updatedCategory);
    return;
  }
  async delete(id: number): Promise<void> {
    await this.categoryRepository.delete(id);
    return;
  }
  private buildQuery = (query: ProductCriteria): Prisma.CategoryWhereInput => {
    const where: Prisma.CategoryWhereInput = {};
    where.AND = [];

    if (query.id) {
      where.AND.push(buildFieldConditions<number>(query.id as NumberFilter));
    }
    return where;
  };
}
