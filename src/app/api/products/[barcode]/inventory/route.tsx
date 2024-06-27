import { getProductByBarcode } from "@/repository/barcodes";
import { getProductPrices } from "@/repository/prices";
import { apiResponse, formatBarcode } from "@/lib/utils";
import { getSession } from "@/auth";
import { getProductStocks } from "@/repository/products";

export async function GET(
  request: Request, 
  { params: { barcode } }: { params: { barcode: string} }  
) {
  
  let auth = getSession();
  let result = {};
  let status = 200;
  let branchId = auth ? auth.branch_id : 0;

  try {
    let product = await getProductByBarcode(formatBarcode(barcode));
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