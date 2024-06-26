import { NextResponse } from "next/server";
import { getProducts } from "@/repository/products";
import { getBarcode, getProductByBarcode } from "@/repository/barcodes";
import { m } from "framer-motion";
import { SSG_FALLBACK_EXPORT_ERROR } from "next/dist/lib/constants";
import { getProductPrices } from "@/repository/prices";
import { apiResponse } from "@/lib/utils";

const formatBarcode = (code: string): string =>  {
  if (code.length == 13) {
    return code.substr(0, 12);
  }
  return code;
}

export async function GET(
  request: Request, 
  { params: { barcode } }: { params: { barcode: string} }  
) {
  
  let result = {};

  let status = 200;

  try {
    let product = await getProductByBarcode(formatBarcode(barcode));
    let prices = await getProductPrices(product?.product_id);
    result = {
      name: product.name,
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