import { apiResponse } from "@/lib/utils";
import { getPurchaseReturnById } from "@/repository/purchaseReturns";

export async function GET(
  request: Request,
  { params: { id } }: { params: { id: number} }
) {
  let res = await getPurchaseReturnById(id);
  return apiResponse(res, 200);
}