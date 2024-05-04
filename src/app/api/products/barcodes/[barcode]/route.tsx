import { NextResponse } from "next/server";
import { getProducts } from "@/repository/products";
import { getBarcode } from "@/repository/barcodes";

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
  let barcodes = await getBarcode(formatBarcode(barcode));
  return NextResponse.json(barcodes, { status: 200 });
}