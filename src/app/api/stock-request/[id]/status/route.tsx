import { apiResponse } from "@/lib/utils";
import { updateStockRequestItemStatus } from "@/repository/stockRequest";

export async function POST(
  request: Request,
  { params: { id } }: { params: { id: number} }
) {
  let {status} = await request.json();
  await updateStockRequestItemStatus(id, status);
  return apiResponse({success: true}, 200);
}