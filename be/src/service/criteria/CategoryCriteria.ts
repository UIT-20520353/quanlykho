import { Category } from "@prisma/client";
import { FilterOption, StringFilter } from "../../utils/QueryType";

export interface CategoryCriteria extends FilterOption<Category> {
  name?: StringFilter;
}
