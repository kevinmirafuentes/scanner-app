import { NextResponse } from "next/server";
import { getProducts } from "@/repository/products";

export async function GET(request) {
  let products = getProducts();
  return NextResponse.json(products, { status: 200 });
}