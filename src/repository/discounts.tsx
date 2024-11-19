import { query } from "@/repository/db";
import sql from 'mssql';

export async function getSupplierCompanyDiscounts(supp_id: number, branch_id: number) {
  let queryString = `
  select top 1
    d.disc_id1,
    d.disc_id2, 
    d.disc_id3,
    d.disc_id4,
    d.disc_id5,
    d.bo_disc_id1,
    d.bo_disc_id2, 
    d.bo_disc_id3,
    d.bo_disc_id4,
    d.bo_disc_id5
  from imasterprofiles..SupplierCompanyDiscounts d
  inner join imasterprofiles..Branch b on b.comp_id = d.comp_id 
  where d.supp_id = @supp_id and b.branch_id = @branch_id
  `;
  
  let resultset = await query(queryString, [
    {name: 'supp_id', type: sql.BigInt, value: supp_id},
    {name: 'branch_id', type: sql.BigInt, value: branch_id},
  ]);
  
  if (!resultset || resultset.recordset.length === 0) {
    return {};
  }
  return resultset.recordset[0];
}

export async function getSupplierDiscountGrouping(barcode_id: number, supp_id: number, branch_id: number) {
  let queryString = `
  select top 1
    h.disc_id1,
    h.disc_id2, 
    h.disc_id3,
    h.disc_id4,
    h.disc_id5,
    h.bo_disc_id1,
    h.bo_disc_id2, 
    h.bo_disc_id3,
    h.bo_disc_id4,
    h.bo_disc_id5
  from imasterprofiles..SupplierDiscountGroupingH h
  inner join imasterprofiles..SupplierDiscountGroupingD d on d.ref_id = h.ref_id
  inner join imasterprofiles..Branch b on b.comp_id = h.comp_id 
  where h.supp_id = @supp_id 
  and b.branch_id = @branch_id
  and d.barcode_id = @barcode_id
  `;
  
  let resultset = await query(queryString, [
    {name: 'supp_id', type: sql.BigInt, value: supp_id},
    {name: 'branch_id', type: sql.BigInt, value: branch_id},
    {name: 'barcode_id', type: sql.BigInt, value: barcode_id},
  ]);
  
  if (!resultset || resultset.recordset.length === 0) {
    return {};
  }
  return resultset.recordset[0];   
}