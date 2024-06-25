import { query } from "@/repository/db"
interface Product {
  product_id: number;
  product_code: string;
  long_descript: string;
}

export async function getProducts() {
  let queryString = 'select top 1 * from Product';
  let resultSet = await query(queryString);
  // @ts-ignore: This somehow works in mobile
  return resultSet.recordsets[0];
}