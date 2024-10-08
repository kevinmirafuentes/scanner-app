import { apiResponse } from "@/lib/utils";
import { getStockRequestById } from "@/repository/stockRequest";

export async function GET(
  request: Request,
  { params: { id } }: { params: { id: string} }
) {
  let res = await getStockRequestById(id);
  return apiResponse(res, 200);
}