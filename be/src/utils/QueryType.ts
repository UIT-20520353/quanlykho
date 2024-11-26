export interface PagingResult<T> {
  data: T[];
  total: number;
}

export interface PagingOptions {
  page?: string;
  pageSize?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export enum FilterOperator {
  EQUAL = "equals",
  CONTAINS = "contains",
}

export interface StringFilter {
  equals?: string;
  notEquals?: string;
  specified?: boolean;
  in?: string[];
  notIn?: string[];
  contains?: string;
  doesNotContain?: string;
}

export interface NumberFilter {
  equals?: number;
  notEquals?: number;
  specified?: boolean;
  in?: number[];
  notIn?: number[];
  greaterThan?: number;
  lessThan?: number;
  greaterThanOrEqual?: number;
  lessThanOrEqual?: number;
}

export interface DateFilter {
  greaterThan?: string | Date;
  lessThan?: string | Date;
  greaterThanOrEqual?: string | Date;
  lessThanOrEqual?: string | Date;
}

export type FilterOption<T> = {
  [P in keyof T]?: StringFilter | NumberFilter | DateFilter;
};
