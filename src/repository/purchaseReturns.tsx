import { query } from "./db";

// export async function savePurchaseReturn(purchaseReturn: PurchaseReturn) {

// }

export async function getLatestRefNumber(branch: string|number) {
  let queryString = `
    select current_value from imasterprofiles..AutoGenerateNumber where ref_name='${branch}-BADORDERNUMBER'
  `;
  let resultSet = await query(queryString);
  let data = resultSet?.recordset[0];  
  return data;
}