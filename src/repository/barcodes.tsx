import { query } from "@/repository/db"

export interface Barcode {
  product_id: number;
  brcode: string;
}

export async function getBarcode(code: string) {
  let queryString = `select top 1 * from BarcodeH where barcode='${code}'`;
  let resultSet = await query(queryString);

  if (typeof resultSet.recordset[0] !== 'undefined') {
    return resultSet.recordset[0];
  }

  return {};
}

export async function getProductByBarcode(code: string) {
  let clean = code.replace(';', '');
  
  // get product detail 
  let prodSql = `
    select top 1 
      h.barcode_id,
      h.barcode,
      p.product_id,
      p.long_descript as name
    from imasterprofiles.dbo.Product p
    inner join imasterprofiles.dbo.BarcodeH h on (h.product_id = p.product_id)
    where h.barcode = '${clean}'
  `
  let result = await query(prodSql);
  return result?.recordset[0];
};