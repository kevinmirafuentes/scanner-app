import { getCurrentBranch, getSession } from "@/auth";
import { apiResponse } from "@/lib/utils";
import { getBarcodeById } from "@/repository/barcodes";
import { getNextReferenceNumber, savePurchaseReturn } from "@/repository/purchaseReturns";
import { PurchaseReturn, PurchaseReturnItem } from "@/types/types";

const initPurchaseReturnData = async (data: PurchaseReturn) => {
  let nextRefNum = await getNextReferenceNumber();
  let { branch_id } = await getCurrentBranch();
  let { user_id } = await getSession();

  data.branch_id = branch_id;
  data.ref_no = nextRefNum.maxrefnum;
  data.trans_date = new Date(data?.trans_date||'');
  data.user_id = user_id;

  if (data?.items) {
    for (let i = 0; i < data.items?.length; i++) {
      data.items[i] = await initPurchaseReturnItemData(data.items[i]);
    }
  }

  return data;
}

const initPurchaseReturnItemData = async (data: PurchaseReturnItem) => {
  let barcodeInfo = data?.barcode_id ? await getBarcodeById(data.barcode_id) : null;
  return {
    ...data,
    // @TODO: clarify if this is correct default value of items below
    unit_id: barcodeInfo?.unit_id,
  };
}

export async function POST(
  request: Request
) {
  const data = await request.json();
  await savePurchaseReturn(
    await initPurchaseReturnData(data)
  )
  return apiResponse({success: true}, 200);
}