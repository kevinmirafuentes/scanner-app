import { getProductByBarcode } from "@/repository/barcodes";
import { getProductPrices } from "@/repository/prices";
import { apiResponse, formatBarcode } from "@/lib/utils";
import { getCurrentBranch, getSession } from "@/auth";
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
  let { branch_id } = await getCurrentBranch();
  try {
    result = await getProductByBarcode(formatBarcode(barcode), branch_id) || {};
  } catch (err) {
    console.log(err);
    result = {'message': 'Something went wrong'};
    status = 500;
  }
  return apiResponse(result, status);
}