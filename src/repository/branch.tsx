import { query } from "@/repository/db"

export async function getDefaultBranch() {
  let queryString = `
  select top 1
    b.branch_id,
    b.branch_code, 
    b.branch_name
  from imasterprofiles..Branch b
  inner join imasterprofiles..Settings s on s.var_value = b.branch_code 
  where s.var_name = 'DEFAULT_BRANCH'
  `;
  
  let resultset = await query(queryString);
  
  if (!resultset || resultset.recordset.length === 0) {
    return {};
  }
  return resultset.recordset[0];
}