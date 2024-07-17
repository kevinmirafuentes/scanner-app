import { apiResponse } from "@/lib/utils";
import { getNextReferenceNumber } from "@/repository/stockRequest";

export async function GET() {
  let res = await getNextReferenceNumber();
  res.maxrefnum = res.maxrefnum || 1; 
  return apiResponse(res, 200);
}