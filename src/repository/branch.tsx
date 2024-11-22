import { query } from "@/repository/db";
import sql from 'mssql';

export async function getDefaultBranch() {
  let queryString = `
  select top 1
    b.branch_id,
    b.branch_code, 
    b.branch_name,
    b.address
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

export async function getBranchById(id: number) 
{
  let queryString = `
    select top 1
      b.branch_id,
      b.branch_code, 
      b.branch_name,
      c.address
    from imasterprofiles..Branch b
    inner join imasterprofiles..Company c on c.comp_id = b.comp_id
    where b.branch_id = @id
  `;
  
  let resultset = await query(queryString, [
    {name: 'id', type: sql.BigInt, value: id}
  ]);
  
  if (!resultset || resultset.recordset.length === 0) {
    return {};
  }
  return resultset.recordset[0];
}

export async function getBranches() {
  let sql = `
    select 
      branch_id,
      REPLACE(branch_code, ' ', '') as branch_code,
      branch_name
    from imasterprofiles..Branch 
  `
  let result = await query(sql);
  return result?.recordset;
}