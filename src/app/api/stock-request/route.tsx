import { getSession } from "@/auth";
import { apiResponse } from "@/lib/utils";
import { saveStockRequest } from "@/repository/stockRequest";
import { StoreStockRequest } from "@/types/types";

export async function POST(
  request: Request
) {

  let auth = await getSession();
  let stockRequest = await request.json();

  stockRequest.user = {user_id: auth?.user_id};
  stockRequest.trans_date = new Date(stockRequest.trans_date);
  stockRequest.request_status = '';

  let res = await saveStockRequest(stockRequest);
  return apiResponse(res, 200);
}