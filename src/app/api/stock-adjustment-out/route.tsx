import { getCurrentBranch, getSession } from "@/auth";
import { apiResponse } from "@/lib/utils";
import { getBarcodeById } from "@/repository/barcodes";
import { getProductOrderCostHistory } from "@/repository/products";
import { getLatestRefNumber, getNextReferenceNumber, saveStockAdjustmentOut } from "@/repository/stockAdjustmentOut";
import { StockAdjustmentOut, StockAdjustmentOutItem } from "@/types/types";

const initStockAdjustmentOut = async (data: StockAdjustmentOut) => {
  let {maxrefnum} = await getNextReferenceNumber();
  let { branch_id } = await getCurrentBranch();
  let { user_id } = await getSession();
  let items = data.items ? await Promise.all(data.items?.map(async (i) => await initStockAdjustmentOutItem(i))) : [];

  return {
    branch_id:      branch_id, 
    adj_no:         maxrefnum.toString(),
    status:         'A', 
    trans_date:     new Date(data?.trans_date||''), 
    remarks:        data.remarks, 
    total_qty:      items.reduce((a, i: StockAdjustmentOutItem) => a + (i?.qty||0), 0), 
    total_net_amt:  0, 
    user_id:        user_id, 
    posted:         0, 
    branch_ref_no:  await getLatestRefNumber(branch_id), 
    items:          items,
  };
}

const initStockAdjustmentOutItem  = async (data: StockAdjustmentOutItem) => {
  let {unit_id, product_id, content_qty}  = data.barcode_id ? await getBarcodeById(data.barcode_id) : null;
  let productOrderCostHistory = await getProductOrderCostHistory(product_id);
  let unitPrice = productOrderCostHistory?.order_pcs_gross_cost || 0;
  return {
    barcode_id: data.barcode_id,
    qty:        data.qty,
    unit_id:    unit_id, 
    unit_price: unitPrice,
    base_qty:   (data?.qty||0) * (content_qty),  
    net_amt:    0, 
  }
}

export async function POST(
  request: Request
) {
  const data = await request.json();
  await saveStockAdjustmentOut(
    await initStockAdjustmentOut(data)
  )
  return apiResponse({success: true}, 200);
}