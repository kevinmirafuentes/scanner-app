import { query } from "@/repository/db"
import sql from 'mssql';

export async function getProducts() {
  let queryString = 'select top 1 * from Product';
  let resultSet = await query(queryString);
  // @ts-ignore: This somehow works in mobile
  return resultSet.recordsets[0];
}

export async function getProductStocks(productId: number, branchId?: number) {
  let queryString = `
    select top 1
      p.product_code as barcode, 
      p.long_descript as name,
      s.qty_on_hand, 
      cast((s.qty_on_hand / u.content_qty) as decimal(18, 2)) as stock_qty_converted_to_order_unit, 
      u.unit_code as uom
	  from imasterprofiles..stocks s
	  left join imasterprofiles..product p on s.product_id = p.product_id
	  left join imasterprofiles..unit u on p.order_unit_id = u.unit_id
    where p.product_id = @prodid
    and s.branch_id = @branchid
  `;

  let result = await query(queryString,  [
    {name: 'prodid', type: sql.BigInt, value: productId},
    {name: 'branchid', type: sql.BigInt, value: branchId || 0}
  ]);
  return result?.recordset[0];
}