import { query } from "@/repository/db"

export async function getDistributors() {
  let sql = `
  select 
    distributor_id,
    REPLACE(distributor_code, ' ', '') as distributor_code,
    distributor_name
  from imasterprofiles..Distributor
`
  let result = await query(sql);
  return result?.recordset;
}