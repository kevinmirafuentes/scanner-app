import { query } from "@/repository/db"
import sql from 'mssql';

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

export async function getSupplierById(id: number) 
{
  let queryString = `
    select
      supp_id, 
      supp_name
    from imasterprofiles..Supplier
    where supp_id = @id
  `;
  
  let resultset = await query(queryString, [
    {name: 'id', type: sql.BigInt, value: id}
  ]);
  
  if (!resultset || resultset.recordset.length === 0) {
    return {};
  }
  return resultset.recordset[0];
}