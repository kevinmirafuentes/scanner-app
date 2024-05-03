import { NextResponse } from "next/server";
import { getProducts } from "@/repository/products";
import { getBarcode } from "@/repository/barcodes";

export async function GET(
  request, 
  { params }
) {
  let barcodes = await getBarcode(params.barcode);
  return NextResponse.json(barcodes, { status: 200 });
}