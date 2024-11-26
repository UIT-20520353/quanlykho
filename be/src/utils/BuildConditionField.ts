import { FilterOption } from "./QueryType";

export const buildFieldConditions = <T>(
  conditions: Partial<FilterOption<T>[keyof T]>
): Record<string, any> => {
  const fieldConditions: Record<string, any> = {};

  if ("equals" in conditions && conditions.equals !== undefined) {
    fieldConditions.equals = conditions.equals;
  }
  if ("notEquals" in conditions && conditions.notEquals !== undefined) {
    fieldConditions.not = conditions.notEquals;
  }
  if ("specified" in conditions && conditions.specified !== undefined) {
    fieldConditions[conditions.specified ? "not" : "equals"] = null;
  }
  if ("in" in conditions && conditions.in !== undefined) {
    fieldConditions.in = conditions.in;
  }
  if ("notIn" in conditions && conditions.notIn !== undefined) {
    fieldConditions.notIn = conditions.notIn;
  }
  if ("contains" in conditions && conditions.contains !== undefined) {
    fieldConditions.contains = conditions.contains;
  }
  if (
    "doesNotContain" in conditions &&
    conditions.doesNotContain !== undefined
  ) {
    fieldConditions.not = { contains: conditions.doesNotContain };
  }
  if ("greaterThan" in conditions && conditions.greaterThan !== undefined) {
    fieldConditions.gt = conditions.greaterThan;
  }
  if ("lessThan" in conditions && conditions.lessThan !== undefined) {
    fieldConditions.lt = conditions.lessThan;
  }
  if (
    "greaterThanOrEqual" in conditions &&
    conditions.greaterThanOrEqual !== undefined
  ) {
    fieldConditions.gte = conditions.greaterThanOrEqual;
  }
  if (
    "lessThanOrEqual" in conditions &&
    conditions.lessThanOrEqual !== undefined
  ) {
    fieldConditions.lte = conditions.lessThanOrEqual;
  }

  return fieldConditions;
};
