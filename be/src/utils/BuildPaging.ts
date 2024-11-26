import { PagingOptions } from "./QueryType";

export const buildPaging = ({
  page = "1",
  pageSize = "10",
  sortBy = "id",
  sortOrder = "desc",
}: PagingOptions) => {
  return {
    orderBy: { [sortBy]: sortOrder },
    skip: (parseInt(page) - 1) * parseInt(pageSize),
    take: parseInt(pageSize),
  };
};
