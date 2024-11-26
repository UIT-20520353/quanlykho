import { ImportDetailModel, ImportModel } from "../model/Import";
import { Decimal } from "@prisma/client/runtime/library";
import { UserMapper } from "./UserMapper";
import { ImportWithDetailsAndUser } from "../repository/ImportRepository";

export class ImportMapper {
  userMapper = new UserMapper();
  toDto(existingImport: ImportWithDetailsAndUser): ImportModel {
    return {
      id: existingImport.id,
      userId: existingImport.userId,
      user: this.userMapper.toDto(existingImport.user),
      createdDate: existingImport.createdDate,
      confirmDate: existingImport.confirmDate ?? null,
      importDetails: existingImport.importDetails.map((detail) =>
        this.toDetailDto({
          ...detail,
          product: detail.product,
        })
      ),
    };
  }
  toDetailDto(existingImportDetail: {
    id: number;
    productId: number;
    quantity: number;
    totalPrice: Decimal;
    importId: number;
    product: { id: number; name: string; price: Decimal; cost: Decimal };
  }): ImportDetailModel {
    return {
      id: existingImportDetail.id,
      productId: existingImportDetail.productId,
      quantity: existingImportDetail.quantity,
      totalPrice: existingImportDetail.totalPrice.toNumber(),
      importId: existingImportDetail.importId,
      product: {
        id: existingImportDetail.product.id,
        name: existingImportDetail.product.name,
        price: existingImportDetail.product.price.toNumber(),
        cost: existingImportDetail.product.cost.toNumber(),
      },
    };
  }
}
