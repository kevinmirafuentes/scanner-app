import { query } from "@/repository/db"

export async function getProductPrices(productId: number, branchId?: number) {
  
  // get product detail 
  let sql = `
    select h.barcode_id,
      h.barcode,
      p.product_code, 
      p.long_descript as name,
      p.short_descript,
      d.retail_markup_per as retail_markup,
      d.retail_selling_price as retail_unit_price,
      r.retail_qty2,
      case when r.retail_qty2 > 0 then r.retail_selling_price2/r.retail_qty2 else 0 end as retail_unit_price2, 
      r.retail_qty3,
      case when r.retail_qty3 > 0 then r.retail_selling_price3/r.retail_qty3 else 0 end as retail_unit_price3, 
      r.retail_qty4,
      r.retail_selling_price4,
      case when r.retail_qty4 > 0 then r.retail_selling_price4/r.retail_qty4 else 0 end as retail_unit_price4, 
      u.unit_code as uom,
      s.supp_name, 
      s.supp_id,
      st.qty_on_hand, 
      st.qty_on_hand / u.content_qty as stock_qty_converted_to_order_unit
    from imasterprofiles.dbo.BarcodeH h
    inner join imasterprofiles.dbo.BarcodeD d on (d.barcode_id = h.barcode_id)
    left join imasterprofiles.dbo.BarcodeR r on (r.barcode_id = h.barcode_id and d.branch_id = r.branch_id)
    inner join imasterprofiles.dbo.Product p on (p.product_id = h.product_id)
    inner join imasterprofiles.dbo.unit u on h.unit_id = u.unit_id
    inner join imasterprofiles.dbo.Supplier s on s.supp_id = p.supp_id
    left join stocks st on (st.product_id = p.product_id and st.branch_id = d.branch_id)
    where p.product_id = '${productId}'
    and d.branch_id = '${branchId}'
  `;

  let result = await query(sql);
  return result?.recordset;
}