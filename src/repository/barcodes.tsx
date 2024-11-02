import { getCurrentBranch } from "@/auth";
import { query } from "@/repository/db"
import { Barcode } from "@/types/types";

export async function getBarcode(code: string) {
  let queryString = `select top 1 * from BarcodeH where barcode='${code}'`;
  let resultSet = await query(queryString);

  if (typeof resultSet.recordset[0] !== 'undefined') {
    return resultSet.recordset[0];
  }

  return {};
}

export async function getProductByBarcode(code: string, branchId: number) {
  let clean = code.replace(';', '');
  
  // get product detail 
  let prodSql = `
    select top 1 
      h.barcode_id,
      h.barcode,
      p.product_id,
      p.long_descript as name,
      d.retail_selling_price as retail_unit_price
    from imasterprofiles.dbo.Product p
    inner join imasterprofiles.dbo.BarcodeH h on (h.product_id = p.product_id)
    inner join imasterprofiles.dbo.BarcodeD d on (d.barcode_id = h.barcode_id)
    where h.barcode = '${clean}'
    and d.branch_id = '${branchId}'
  `
  let result = await query(prodSql);
  return result?.recordset[0];
};

export async function getBarcodeById(id: number) {
  let queryString = `
    select 
      barcode_id, 
      barcode, 
      unit_id, 
      unit_cost 
    from 
      imasterprofiles.dbo.BarcodeH 
    where 
      barcode_id='${id}'
    `;
  let resultSet = await query(queryString);

  if (typeof resultSet.recordset[0] !== 'undefined') {
    return resultSet.recordset[0];
  }

  return {
    barcode_id: null,
    barcode: null
  };
}