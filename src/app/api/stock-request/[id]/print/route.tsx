'use server';
import StockRequestPdf from "@/components/StockRequestPdf";
import { apiResponse } from "@/lib/utils";
import ReactPDF from "@react-pdf/renderer";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function GET(req: NextRequest, res: NextResponse) {
  const dir = path.join(process.cwd(), 'public/generated');
  let id = 1;
  await ReactPDF.render(<StockRequestPdf id={id} />, `${dir}/stock-request-form-${id}.pdf`);
  return apiResponse({'path': 1});
}