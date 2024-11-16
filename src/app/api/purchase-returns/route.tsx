import { getCurrentBranch, getSession } from "@/auth";
import { apiResponse } from "@/lib/utils";
import { getBarcodeById } from "@/repository/barcodes";
import { getSupplierCompanyDiscounts, getSupplierDiscountGrouping } from "@/repository/discounts";
import { getNextReferenceNumber, savePurchaseReturn } from "@/repository/purchaseReturns";
import { PurchaseReturn, PurchaseReturnItem } from "@/types/types";

const initPurchaseReturnData = async (data: PurchaseReturn) => {
  let nextRefNum = await getNextReferenceNumber();
  let { branch_id } = await getCurrentBranch();
  let { user_id } = await getSession();

  data.branch_id = branch_id;
  data.ref_no = nextRefNum.maxrefnum.toString();
  data.trans_date = new Date(data?.trans_date||'');
  data.user_id = user_id;
  data.status = 'A';
  data.amt_paid = 0;
  data.balance = 0;
  data.posted = 0;
  data.vat_price_indicator = 0;
  
  let supplierCompanyDiscounts = await getSupplierCompanyDiscounts(data.supp_id||0, data.branch_id||0);
  data.disc_id1 = supplierCompanyDiscounts?.disc_id1;
  data.disc_id2 = supplierCompanyDiscounts?.disc_id2;
  data.disc_id3 = supplierCompanyDiscounts?.disc_id3;
  data.disc_id4 = supplierCompanyDiscounts?.disc_id4;

  if (data?.items) {
    for (let i = 0; i < data.items?.length; i++) {
      data.items[i] = await initPurchaseReturnItemData(data.items[i], data);
    }
  }

  return data;
}

const initPurchaseReturnItemData = async (data: PurchaseReturnItem, purchaseReturn: PurchaseReturn) => {
  let barcodeInfo = data?.barcode_id ? await getBarcodeById(data.barcode_id) : null;

  let supplierDiscount = await getSupplierDiscountGrouping(
    data?.barcode_id||0, 
    purchaseReturn?.supp_id||0, 
    purchaseReturn?.balance||0
  );
  return {
    ...data,
    disc_id1: supplierDiscount?.disc_id1||0,
    disc_id2: supplierDiscount?.disc_id2||0,
    disc_id3: supplierDiscount?.disc_id3||0,
    disc_id4: supplierDiscount?.disc_id4||0,

    // @TODO: clarify if this is correct default value of items below
    unit_id: barcodeInfo?.unit_id,
    unit_price: barcodeInfo?.unit_cost,
    gross_amt: barcodeInfo?.order_whole_gross_cost||0,
    net_amt: barcodeInfo?.order_whole_net_cost||0,
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