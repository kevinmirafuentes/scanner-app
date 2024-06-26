import { getProductByBarcode } from "@/repository/barcodes";
import { getProductPrices } from "@/repository/prices";
import { apiResponse, formatBarcode } from "@/lib/utils";
import { getSession } from "@/auth";

export async function GET(
  request: Request, 
  { params: { barcode } }: { params: { barcode: string} }  
) {

  let auth = getSession();
  let result = {};
  let status = 200;
  let branchId = auth ? auth.branch_id : null;
  
  try {
    let product = await getProductByBarcode(formatBarcode(barcode));
    let prices = [];

    if (product?.product_id) {
      prices = await getProductPrices(product?.product_id, branchId);
    }
    
    result = {
      name: product?.name,
      prices: prices,
    };
  } catch (err) {
    result = {
      'message': 'Something went wrong'
    };
    status = 500;
  }
  
  return apiResponse(result, status);
}