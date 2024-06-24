import { query } from "@/repository/db"

export async function getProductPrices(productId: number) {
  
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
      r.retail_markup_per2 as retail_markup2, 
      r.retail_qty3,
      r.retail_markup_per3 as retail_markup3,
      r.retail_qty4,
      r.retail_markup_per4 as retail_markup4,
      u.unit_code as uom,
      s.supp_name, 
      s.supp_id
    from imasterprofiles.dbo.BarcodeH h
    inner join imasterprofiles.dbo.BarcodeD d on (d.barcode_id = h.barcode_id)
    left join imasterprofiles.dbo.BarcodeR r on (r.barcode_id = h.barcode_id)
    inner join imasterprofiles.dbo.Product p on (p.product_id = h.product_id)
    inner join imasterprofiles.dbo.unit u on h.unit_id = u.unit_id
    inner join imasterprofiles.dbo.Supplier s on s.supp_id = p.supp_id
    where p.product_id = '${productId}'
  `;

  let result = await query(sql);
  return result?.recordset;
}