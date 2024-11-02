import { getCurrentBranch, getSession } from "@/auth";
import { apiResponse } from "@/lib/utils";
import { getBarcodeById } from "@/repository/barcodes";
import { getNextReferenceNumber, savePhysicalCount } from "@/repository/physicalCount";
import { PhysicalCount } from "@/types/types";

const initPhysicalCountData = async (data: PhysicalCount) => {
  let nextRefNum = await getNextReferenceNumber();
  let { branch_id } = await getCurrentBranch();
  let { user_id } = await getSession();;
  
  // @TODO: clarify if this is correct default value of items below
  data.status = 'A'; 
  data.return_slip_no = 0; 
  data.remarks = ''; 
  data.total_qty = 0;
  data.total_gross_amt = 0;
  data.total_disc_amt = 0;
  data.total_freight_amt = 0;
  data.total_charges_amt = 0;
  data.total_vat_amt = 0;
  data.total_net_amt = 0;
  data.amt_paid = 0;
  data.balance = 0;
  data.total_vatable_amt = 0;
  data.total_non_vatable_amt = 0;
  data.user_id = user_id;

  data.branch_id = branch_id;
  data.ref_no = nextRefNum.maxrefnum;
  data.date = new Date(data?.date||'');
  
  if (data?.items) {
    for (let i = 0; i < data.items?.length; i++) {
      let barcodeInfo = data.items[i].barcode_id ? await getBarcodeById(data.items[i].barcode_id) : null;
      data.items[i] = {
        ...data.items[i],
        unit_id: barcodeInfo?.unit_id, 
        unit_price: barcodeInfo?.unit_cost
      }
    }
  }
  
  return data;
}

export async function POST(
  request: Request
) {
  const data = await request.json();
  await savePhysicalCount(
    await initPhysicalCountData(data)
  )
  return apiResponse({success: true}, 200);
}