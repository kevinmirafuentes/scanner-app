import { getCurrentBranch, getSession } from "@/auth";
import { apiResponse } from "@/lib/utils";
import { getBarcodeById } from "@/repository/barcodes";
import { getNextReferenceNumber, saveStockTransferOut } from "@/repository/stockTransferOut";
import { StockTransferOut, StockTransferOutItem } from "@/types/types";

const initStockTransferOutData = async (data: StockTransferOut) => {
  let nextRefNum = await getNextReferenceNumber();
  let { user_id } = await getSession();
  let { branch_id } = await getCurrentBranch();
  
  // @TODO: clarify if this is correct default value of items below
  data.status = 'A';
  data.source_branch_id = branch_id;

  data.ref_no = nextRefNum.maxrefnum.toString();
  data.trans_date = new Date(data.trans_date||'');  
  data.user_id = user_id;

  if (data?.items) {
    for (let i = 0; i < data.items?.length; i++) {
      data.items[i] = await initStockTransferOutItemData(data.items[i]);
    }
  }
  
  return data;
}

const initStockTransferOutItemData  = async (data: StockTransferOutItem) => {
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
  await saveStockTransferOut(
    await initStockTransferOutData(data)
  )
  return apiResponse({success: true}, 200);
}