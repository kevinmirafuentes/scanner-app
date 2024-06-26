import { getProductByBarcode } from "@/repository/barcodes";
import { getProductPrices } from "@/repository/prices";
import { apiResponse, formatBarcode } from "@/lib/utils";

export async function GET(
  request: Request, 
  { params: { barcode } }: { params: { barcode: string} }  
) {
  let status = 200;
  let result = {
    'name': 'Payless noodles',
    'barcode': barcode, 
    'inventory': 1, 
    'order_unit': 2,
  };

  return apiResponse(result, status);
}