import { getCurrentBranch, getSession } from "@/auth";
import { apiResponse } from "@/lib/utils";
import { getBarcodeById } from "@/repository/barcodes";
import { getSupplierCompanyDiscounts, getSupplierDiscountGrouping } from "@/repository/discounts";
import { getProductOrderCostHistory } from "@/repository/products";
import { getLatestRefNumber, getNextReferenceNumber, getPurchaseReturnsByDate, savePurchaseReturn } from "@/repository/purchaseReturns";
import { PurchaseReturn, PurchaseReturnItem } from "@/types/types";

const initPurchaseReturnData = async (data: PurchaseReturn) => {
  let {maxrefnum} = await getNextReferenceNumber();
  let { branch_id } = await getCurrentBranch();
  let { user_id } = await getSession();
  let boDiscounts = await getSupplierCompanyDiscounts(data.supp_id||0, branch_id);

  let items = data.items ? await Promise.all(data.items?.map(async (i) => await initPurchaseReturnItemData(i, data))) : [];
  
  return {
    branch_id:          branch_id,
    ref_no:             maxrefnum, 
    status:             'A', 
    trans_date:         new Date(data.trans_date||''),
    supp_id:            data.supp_id, 
    return_slip_no:     data.return_slip_no, 
    remarks:            data.remarks, 
    total_qty:          items.reduce((a, i: PurchaseReturnItem) => a + (i?.qty||0), 0), 
    total_gross_amt:    items.reduce((a, i: PurchaseReturnItem) => a + (i?.gross_amt||0), 0), 
    total_disc_amt:     0, 
    total_freight_amt:  0, 
    total_charges_amt:  0, 
    total_vat_amt:      0, 
    total_net_amt:      0, 
    amt_paid:           0,
    balance:            0, 
    total_vatable_amt:  0, 
    total_non_vatable_amt: 0, 
    disc_id1:           boDiscounts?.disc_id1 || 0, 
    disc_id2:           boDiscounts?.disc_id2 || 0, 
    disc_id3:           boDiscounts?.disc_id3 || 0, 
    disc_id4:           boDiscounts?.disc_id4 || 0,
    disc_id5:           boDiscounts?.disc_id5 || 0,
    user_id:            user_id,
    posted:             0,
    vat_price_indicator: 0, 
    branch_ref_no:      await getLatestRefNumber(branch_id), 
    distributor_id:     0,
    items:              items,
  };
}

const initPurchaseReturnItemData = async (data: PurchaseReturnItem, purchaseReturn: PurchaseReturn) => {
  let barcodeInfo = data?.barcode_id ? await getBarcodeById(data.barcode_id) : null;
  let supplierDiscount = await getSupplierDiscountGrouping(
    data?.barcode_id||0, 
    purchaseReturn?.supp_id||0, 
    purchaseReturn?.branch_id||0
  );

  let productOrderCostHistory = await getProductOrderCostHistory(barcodeInfo.product_id);
  let unitPrice = productOrderCostHistory?.order_pcs_gross_cost || 0;

  return {
    barcode_id:         data.barcode_id, 
    qty:                data.qty, 
    unit_id:            barcodeInfo.unit_id, 
    unit_price:         unitPrice, 
    gross_amt:          unitPrice * (data?.qty||0), 
    base_qty:           (data.qty||0) * (barcodeInfo.content_qty||0), 
    disc_id1:           supplierDiscount.bo_disc_id1, 
    disc_id2:           supplierDiscount.bo_disc_id2, 
    disc_id3:           supplierDiscount.bo_disc_id3,
    disc_id4:           supplierDiscount.bo_disc_id4,
    disc_id5:           supplierDiscount.bo_disc_id5,
    disc_amt:           0, 
    prorated_disc_amt:  0, 
    freight_id:         0, 
    freight_amt:        0, 
    charges_id:         0, 
    charges_amt:        0, 
    net_amt:            0, 
    total_cost:         0,
  };
}

export async function POST(
  request: Request
) {
  const data = await request.json();
  let purchaseReturn = await savePurchaseReturn(
    await initPurchaseReturnData(data)
  )
  return apiResponse(purchaseReturn, 200);
}

export async function GET(
  request: Request
) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const results = await getPurchaseReturnsByDate(new Date(searchParams.get('date') || ''));
  return apiResponse(results, 200);
}