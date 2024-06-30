import { getSession } from "@/auth";
import { apiResponse } from "@/lib/utils";
import { saveStockRequest } from "@/repository/stockRequest";

export async function GET(
  request: Request, 
  // data: StoreStockRequest 
) {

  let auth = await getSession();
  
  let stockRequest = {
    ref_no: 'test',
    trans_date: new Date, 
    remarks: 'Sample remarks',
    user: {
      user_id: auth?.user_id
    },
    request_status: 'A',
    items: [
      {
        barcode_id: 1,
        qty: 2
      },
      {
        barcode_id: 2,
        qty: 3
      }
    ]
  }

  let res = await saveStockRequest(stockRequest);
  return apiResponse(res, 200);
}