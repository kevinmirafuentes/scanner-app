import { getCurrentBranch, getSession } from "@/auth";
import { apiResponse } from "@/lib/utils";
import { getBarcodeById } from "@/repository/barcodes";
import { getNextReferenceNumber, saveStockTransferIn } from "@/repository/stockTransferIn";
import { StockTransferIn, StockTransferInItem } from "@/types/types";

const initStockTransferInData = async (data: StockTransferIn) => {
  let nextRefNum = await getNextReferenceNumber();
  let { branch_id } = await getCurrentBranch();
  let { user_id } = await getSession();

  // @TODO: clarify if this is correct default value of items below
  data.status = 'A';
  data.source_branch_id = data.source_branch_id; 
  data.branch_ref_no = data.branch_ref_no;
  data.remarks = '';
  data.total_qty = 0;
  data.total_freight_amt = 0;
  data.total_disc_amt = 0;
  data.total_charges_amt = 0;
  data.total_gross_amt = 0;
  data.total_vat_amt = 0;
  data.total_net_amt = 0;
  data.amt_paid = 0;
  data.balance = 0;
  data.total_vatable_amt = 0;
  data.total_non_vatable_amt = 0;
  data.transfer_slip_no = '';

  data.branch_id = branch_id;
  data.ref_no = nextRefNum.maxrefnum.toString();
  data.trans_date = new Date(data.trans_date||'');  
  data.user_id = user_id;

  if (data?.items) {
    for (let i = 0; i < data.items?.length; i++) {
      data.items[i] = await initStockTransferInItemData(data.items[i]);
    }
  }
  
  return data;
}

const initStockTransferInItemData  = async (data: StockTransferInItem) => {
  let barcodeInfo = data.barcode_id ? await getBarcodeById(data.barcode_id) : null;
  return {
    // @TODO: clarify if this is correct default value of items below
    ...data,
    unit_id: barcodeInfo?.unit_id, 
    unit_price: barcodeInfo?.unit_cost,
    gross_amt: 0,
    base_qty: 0,
    disc_id1: 0,
    disc_id2: 0,
    disc_id3: 0,
    disc_id4: 0,
    disc_id5: 0,
    disc_id6: 0,
    disc_id7: 0,
    disc_id8: 0,
    disc_amt: 0,
    freight_id: 0,
    freight_amt: 0,
    charges_id: 0,
    charges_amt: 0,
    net_amt: 0,
    total_cost: 0,
  };
}

export async function POST(
  request: Request
) {
  const data = await request.json();
  await saveStockTransferIn(
    await initStockTransferInData(data)
  )
  return apiResponse({success: true}, 200);
}