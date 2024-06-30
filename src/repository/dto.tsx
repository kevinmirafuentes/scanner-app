import { getStockRequestItems } from "./stockRequest";
import { getUserById } from "./users";

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