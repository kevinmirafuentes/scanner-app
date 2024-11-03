import { getCurrentBranch, getSession } from "@/auth";
import { apiResponse } from "@/lib/utils";
import { getBarcodeById } from "@/repository/barcodes";
import { getNextReferenceNumber, savePhysicalCount } from "@/repository/physicalCount";
import { PhysicalCount, PhysicalCountItem } from "@/types/types";

const initPhysicalCountData = async (data: PhysicalCount) => {
  let nextRefNum = await getNextReferenceNumber();
  let { branch_id } = await getCurrentBranch();
  let { user_id } = await getSession();

  data.branch_id = branch_id;
  data.ref_no = nextRefNum.maxrefnum;
  data.trans_date = new Date(data?.trans_date||'');
  data.user_id = user_id;

  // @TODO: clarify if this is correct default value of items below
  data.remarks = '';
  data.total_amt = 0;
  data.prepared_id = 0;
  data.approved_id = 0;
  data.prev_physical_id = 0;
  data.posted = 0;  

  if (data?.items) {
    for (let i = 0; i < data.items?.length; i++) {
      data.items[i] = await initPhysicalCountItem(data.items[i]);
    }
  }
  
  return data;
}

const initPhysicalCountItem = async (data: PhysicalCountItem) => {
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
  await savePhysicalCount(
    await initPhysicalCountData(data)
  )
  return apiResponse({success: true}, 200);
}