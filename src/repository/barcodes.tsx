import { query } from "@/repository/db"

export interface Barcode {
  product_id: number;
  brcode: string;
}

export async function getBarcode(code: string) {
  let queryString = `select top 10 * from BarcodeH = "${code}"`;
  let resultSet = await query(queryString);
  // @ts-ignore: This somehow works in mobile
  return resultSet.recordsets[0];
}