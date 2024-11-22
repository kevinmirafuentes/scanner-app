import { PurchaseReturn, PurchaseReturnItem } from "@/types/types";
import { getStockRequestItems } from "./stockRequest";
import { getTagRequestItems } from "./tagRequest";
import { getUserById } from "./users";
import { getPurchaseReturnItems } from "./purchaseReturns";
import { getBranchById } from "./branch";
import { getSupplierById } from "./suppliers";

export async function stockRequestDTO(data: any) {
  return {
    ref_id: data.ref_id, 
    ref_no: data.ref_no,
    trans_date: data.trans_date, 
    date_created: new Date(data.date_created), 
    user: await getUserById(data.user_id),
    items: await getStockRequestItems(data.ref_id)
  }
}

export async function tagRequestDTO(data: any, branchId?: number) {
  return {
    ref_id: data.ref_id,  
    date_created: new Date(data.date_created), 
    user: await getUserById(data.user_id),
    items: await getTagRequestItems(data.ref_id, branchId)
  }
}

export async function purchaseReturnDTO(data: PurchaseReturn): Promise<PurchaseReturn> {
  return {
    ...data, 
    branch: await getBranchById(data?.branch_id||0),
    supplier: await getSupplierById(data?.supp_id||0),
    trans_date: new Date(data.trans_date||'1900-01-01'),
    date_created: new Date(data.date_created||'1900-01-01'),
    items: await getPurchaseReturnItems(data.ref_id||0),
  }
}