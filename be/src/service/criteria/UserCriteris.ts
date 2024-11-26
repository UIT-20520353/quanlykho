import {
  FilterOption,
  NumberFilter,
  StringFilter,
} from "../../utils/QueryType";
import { User } from "@prisma/client";

export interface UserCriteria extends FilterOption<User> {
  username?: StringFilter;
  name?: StringFilter;
  userId?: NumberFilter;
  role?: StringFilter;
}
