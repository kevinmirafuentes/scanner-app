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

export async function getProductStocks(productId: number, branchId?: number) {
  let queryString = `
    select top 1
      p.product_code, 
      p.long_descript as name,
      s.qty_on_hand, 
      s.qty_on_hand / u.content_qty as stock_qty_converted_to_order_unit, 
      u.unit_code as uom
	  from imasterprofiles..stocks s
	  left join imasterprofiles..product p on s.product_id = p.product_id
	  left join imasterprofiles..unit u on p.order_unit_id = u.unit_id
    where p.product_id = '${productId}'
  `;

  let result = await query(queryString);
  return result?.recordset[0];
}