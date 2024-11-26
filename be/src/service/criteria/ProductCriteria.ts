import { Product } from "@prisma/client";
import {
  FilterOption,
  NumberFilter,
  StringFilter,
} from "../../utils/QueryType";

export interface ProductCriteria extends FilterOption<Product> {
  name?: StringFilter;
  categoryId?: NumberFilter;
}
