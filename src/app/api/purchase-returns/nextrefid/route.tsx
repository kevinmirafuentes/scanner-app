import { apiResponse } from "@/lib/utils";
import { getNextReferenceNumber } from "@/repository/purchaseReturns";

export async function POST() {
  let res = await getNextReferenceNumber();
  return apiResponse(res, 200);
}