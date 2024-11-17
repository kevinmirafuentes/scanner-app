import { getCurrentBranch, getSession } from "@/auth";
import { apiResponse } from "@/lib/utils";
import { getBarcodeById } from "@/repository/barcodes";
import { getLatestRefNumber, getNextReferenceNumber, incLatestRefNumber, savePhysicalCount } from "@/repository/physicalCount";
import { PhysicalCount, PhysicalCountItem } from "@/types/types";

const initPhysicalCountData = async (data: PhysicalCount) => {
  let nextRefNum = await getNextReferenceNumber();
  let { branch_id, branch_code } = await getCurrentBranch();
  let { user_id } = await getSession();

  return {
    branch_id:        branch_id, 
    ref_no:           nextRefNum.maxrefnum, 
    trans_date:       new Date(data?.trans_date||''), 
    supp_id:          data.supp_id, 
    remarks:          data.remarks,  
    total_amt:        0, 
    prepared_by:      0, 
    approved_byL:     0, 
    prev_physical_id: 0, 
    branch_ref_no:    await getLatestRefNumber(branch_code.trim()), 
    user_id:          user_id,  
    posted:           0,
    date_uploaded:    new Date('1900-01-01'),
    items:            data.items ? await Promise.all(data.items?.map(async (i) => await initPhysicalCountItem(i))) : [],
  };
}

const initPhysicalCountItem = async (data: PhysicalCountItem) => {
  let barcodeInfo = data?.barcode_id ? await getBarcodeById(data.barcode_id) : null;
  return {
    barcode_id:   data.barcode_id,
    counted_qty:  data.counted_qty,
    unit_id:      barcodeInfo?.unit_id,
  };
}

export async function POST(
  request: Request
) {
  const data = await request.json();
  await savePhysicalCount(
    await initPhysicalCountData(data)
  );

  let {branch_code} = await getCurrentBranch(); 
  await incLatestRefNumber(branch_code);

  return apiResponse({success: true}, 200);
}