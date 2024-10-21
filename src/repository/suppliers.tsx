import { query } from "@/repository/db"

export async function getSuppliers() {
  let queryString = `
    select
      supp_id, 
      supp_name
    from imasterprofiles..supplier
  `;
  let resultSet = await query(queryString);
  return resultSet?.recordset;
}