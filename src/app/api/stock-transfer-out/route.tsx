import { getCurrentBranch, getSession } from "@/auth";
import { apiResponse } from "@/lib/utils";
import { getBarcodeById } from "@/repository/barcodes";
import { getSupplierDiscountGrouping } from "@/repository/discounts";
import { getProductOrderCostHistory } from "@/repository/products";
import { getLatestRefNumber, getNextReferenceNumber, saveStockTransferOut } from "@/repository/stockTransferOut";
import { StockTransferOut, StockTransferOutItem } from "@/types/types";

const initStockTransferOutData = async (data: StockTransferOut) => {
  let {maxrefnum} = await getNextReferenceNumber();
  let { user_id } = await getSession();
  let { branch_id } = await getCurrentBranch();
  
  let items = data.items ? await Promise.all(data.items?.map(async (i) => await initStockTransferOutItemData(i, data))) : [];

  return {
    source_branch_id:     branch_id, 
    ref_no:               maxrefnum.toString(), 
    status:               'A', 
    trans_date:           new Date(data.trans_date||''),
    dest_branch_id:       data.dest_branch_id, 
    remarks:              data.remarks, 
    total_qty:            items.reduce((a, i: StockTransferOutItem) => a + (i?.qty||0), 0),
    total_gross_amt:      items.reduce((a, i: StockTransferOutItem) => a + (i?.gross_amt||0), 0),
    total_disc_amt:       0, 
    total_freight_amt:    0, 
    total_charges_amt:    0, 
    total_vat_amt:        0, 
    total_net_amt:        0, 
    amt_paid:             0,
    balance:              0,
    total_non_vatable_amt:0, 
    user_id:              user_id, 
    posted:               0,
    transfer_type:        1,
    cashier_id:           0, 
    branch_ref_no:        await getLatestRefNumber(branch_id),
    items:                items,
  };
}

const initStockTransferOutItemData  = async (data: StockTransferOutItem, stockTransferOut: StockTransferOut) => {
  let {unit_id, content_qty, product_id, supp_id} = data.barcode_id ? await getBarcodeById(data.barcode_id) : null;
  let productOrderCostHistory = await getProductOrderCostHistory(product_id);
  let unitPrice = productOrderCostHistory?.order_pcs_gross_cost || 0;

  let supplierDiscount = await getSupplierDiscountGrouping(
    data?.barcode_id||0, 
    supp_id||0, 
    stockTransferOut?.source_branch_id||0
  );

  return {
    barcode_id:     data.barcode_id, 
    qty:            data.qty, 
    unit_id:        unit_id, 
    unit_price:     unitPrice, 
    gross_amt:      unitPrice*(data?.qty||0), 
    base_qty:       (data?.qty||0) * (content_qty||0), 
    disc_id1:       supplierDiscount.disc_id1, 
    disc_id2:       supplierDiscount.disc_id2, 
    disc_id3:       supplierDiscount.disc_id3,
    disc_id4:       supplierDiscount.disc_id4,
    disc_id5:       0,
    disc_id6:       0,
    disc_id7:       0,
    disc_id8:       0,
    disc_amt:       0, 
    freight_id:     0, 
    freight_amt:    0, 
    charges_id:     0, 
    charges_amt:    0, 
    net_amt:        0, 
    total_cost:     0,
  }
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