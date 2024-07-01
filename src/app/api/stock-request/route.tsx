import { getSession } from "@/auth";
import { apiResponse } from "@/lib/utils";
import { getStockRequestsByDate, saveStockRequest } from "@/repository/stockRequest";
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

export async function GET(
  request: Request
) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const results = await getStockRequestsByDate(new Date(searchParams.get('date')));
  return apiResponse(results, 200);
}