import { NextResponse } from "next/server";
import { getBarcode } from "@/repository/barcodes";

export async function GET(request) {
  let products = await getBarcode(request.nextUrl.searchParams.get('barcode'));
  return NextResponse.json(products, { status: 200 });
}