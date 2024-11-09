import { getCurrentBranch, getSession } from "@/auth";
import { apiResponse } from "@/lib/utils";
import { getBarcodeById } from "@/repository/barcodes";
import { getNextReferenceNumber, saveStockAdjustmentIn } from "@/repository/stockAdjustmentIn";
import { StockAdjustmentIn, StockAdjustmentInItem } from "@/types/types";

const initStockAdjustmentIn = async (data: StockAdjustmentIn) => {
  let nextRefNum = await getNextReferenceNumber();
  let { branch_id } = await getCurrentBranch();
  let { user_id } = await getSession();

  // @TODO: clarify if this is correct default value of items below
  data.status = 'A';

  data.branch_id = branch_id;
  data.adj_no = nextRefNum.maxrefnum.toString();
  data.trans_date = new Date(data.trans_date||'');  
  data.user_id = user_id;

  if (data?.items) {
    for (let i = 0; i < data.items?.length; i++) {
      data.items[i] = await initStockAdjustmentInItem(data.items[i]);
    }
  }
  
  return data;
}

const initStockAdjustmentInItem  = async (data: StockAdjustmentInItem) => {
  let barcodeInfo = data.barcode_id ? await getBarcodeById(data.barcode_id) : null;
  return {
    // @TODO: clarify if this is correct default value of items below
    ...data,
    unit_id: barcodeInfo?.unit_id, 
    unit_price: barcodeInfo?.unit_cost,
  };
}

export async function POST(
  request: Request
) {
  const data = await request.json();
  await saveStockAdjustmentIn(
    await initStockAdjustmentIn(data)
  )
  return apiResponse({success: true}, 200);
}