import { getProductByBarcode } from "@/repository/barcodes";
import { getProductPrices } from "@/repository/prices";
import { apiResponse, formatBarcode } from "@/lib/utils";
import { getSession } from "@/auth";
import { getProductStocks } from "@/repository/products";
import { getDefaultBranch } from "@/repository/branch";

export async function GET(
  request: Request, 
  { params: { barcode } }: { params: { barcode: string} }  
) {
  
  let auth = getSession();
  let branch = await getDefaultBranch();
  let result = {};
  let status = 200;
  let branchId = branch ? branch.branch_id : 0;

  try {
    let product = await getProductByBarcode(formatBarcode(barcode), branchId);
    let stocks;

    if (product?.product_id) {
      stocks = await getProductStocks(product.product_id, branchId);
    }

    if (stocks && product) {
        result = stocks;
    }

  } catch (err) {

    result = {
      'message': 'Something went wrong'
    };
    
    status = 500;
  
  }

  return apiResponse(result, status);
}