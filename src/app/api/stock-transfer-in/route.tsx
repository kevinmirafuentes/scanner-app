import { getCurrentBranch, getSession } from "@/auth";
import { apiResponse } from "@/lib/utils";
import { getBarcodeById } from "@/repository/barcodes";
import { getSupplierDiscountGrouping } from "@/repository/discounts";
import { getProductOrderCostHistory } from "@/repository/products";
import { getLatestRefNumber, getNextReferenceNumber, saveStockTransferIn } from "@/repository/stockTransferIn";
import { StockTransferIn, StockTransferInItem } from "@/types/types";

const initStockTransferInData = async (data: StockTransferIn) => {
  let {maxrefnum} = await getNextReferenceNumber();
  let { branch_id } = await getCurrentBranch();
  let { user_id } = await getSession();

  let items = data.items ? await Promise.all(data.items?.map(async (i) => await initStockTransferInItemData(i, data))) : [];

  return {
    branch_id:            branch_id,
    ref_no:               maxrefnum.toString(),
    status:               'A',
    trans_date:           new Date(data.trans_date||''),
    source_branch_id:     data.source_branch_id,
    transfer_out_ref_no:  data.transfer_out_ref_no,    
    remarks:              data.remarks, 
    total_qty:            items.reduce((a, i: StockTransferInItem) => a + (i?.qty||0), 0),
    total_freight_amount: 0, 
    total_disc_amount:    0, 
    total_charges_amt:    0, 
    total_gross_amt:      items.reduce((a, i: StockTransferInItem) => a + (i?.gross_amt||0), 0),
    total_vat_amt:        0, 
    total_net_amt:        0, 
    amt_paid:             0, 
    balance:              0, 
    total_vatable_amt:    0, 
    total_non_vatable_amt:0, 
    user_id:              user_id, 
    posted:               0, 
    branch_ref_no:        await getLatestRefNumber(branch_id), 
    transfer_slip_no:     null,
    items:                items,
  };
}

const initStockTransferInItemData  = async (data: StockTransferInItem, stockTransferIn: StockTransferIn) => {
  let barcodeInfo = data.barcode_id ? await getBarcodeById(data.barcode_id) : null;
  let supplierDiscount = await getSupplierDiscountGrouping(
    data?.barcode_id||0, 
    barcodeInfo?.supp_id||0, 
    stockTransferIn?.branch_id||0
  );
  let productOrderCostHistory = await getProductOrderCostHistory(barcodeInfo.product_id);
  let unitPrice = productOrderCostHistory?.order_pcs_gross_cost || 0;

  return {
    barcode_id:   data.barcode_id, 
    qty:          data.qty, 
    unit_id:      barcodeInfo.unit_id, 
    unit_price:   unitPrice, 
    gross_amt:    unitPrice * (data?.qty||0), 
    base_qty:     (data?.qty||0) * (barcodeInfo.content_qty), 
    disc_id1:     supplierDiscount.disc_id1, 
    disc_id2:     supplierDiscount.disc_id2, 
    disc_id3:     supplierDiscount.disc_id3, 
    disc_id4:     supplierDiscount.disc_id4, 
    disc_id5:     0, 
    disc_id6:     0, 
    disc_id7:     0, 
    disc_id8:     0, 
    disc_amt:     0, 
    freight_id:   0, 
    freight_amt:  0, 
    charges_id:   0, 
    charges_amt:  0, 
    net_amt:      0, 
    total_cost:   0, 
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