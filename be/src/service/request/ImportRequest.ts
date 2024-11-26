export type ImportRequest = {
  importDetails: ImportDetailRequest[];
};

export type ImportDetailRequest = {
  productId: number;
  quantity: number;
};
