import { getProductByBarcode } from "@/repository/barcodes";
import { getProductPrices } from "@/repository/prices";
import { apiResponse, formatBarcode } from "@/lib/utils";
import { getSession } from "@/auth";
import { getDefaultBranch } from "@/repository/branch";
import { getProductStocks } from "@/repository/products";

// todo:
//  - when admin user; then do not include supplier details
//  - when admin user; include inventory per price/uom

export async function GET(
  request: Request,
  { params: { barcode } }: { params: { barcode: string} }
) {
  let result = {};
  let status = 200;

  try {
    result = await getProductByBarcode(formatBarcode(barcode)) || {};
  } catch (err) {
    console.log(err);
    result = {'message': 'Something went wrong'};
    status = 500;
  }
  return apiResponse(result, status);
}