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

  return [];
}