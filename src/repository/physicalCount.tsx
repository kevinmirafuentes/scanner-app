import { PhysicalCount, PhysicalCountItem } from "@/types/types";
import { query } from "./db";
import sql from 'mssql';

const createLatestRefNum = async (branchId: number) => {
  let insertSql = `
    insert into imasterprofiles..AutoGenerateNumber (
      ref_name,
      current_value
    ) 
    select 
      ltrim(rtrim(b.branch_code)) + '-PHYSICAL REF NUMBER-MOBILE' as ref_name,
      1 as current_value
    from imasterprofiles..branch b where b.branch_id = @branch_id
  `;
  await query(insertSql, [
    {name: 'branch_id', type: sql.BigInt, value: branchId},
  ]);
  return 1;
};

export async function getLatestRefNumber(branchId: number) {
  let querySql = `
    select current_value 
    from imasterprofiles..AutoGenerateNumber 
    where ref_name=(select top 1 ltrim(rtrim(b.branch_code)) + '-PHYSICAL REF NUMBER-MOBILE' from imasterprofiles..branch b where b.branch_id = @branch_id)
  `;
  
  let resultSet = await query(querySql, [
    {name: 'branch_id', type: sql.BigInt, value: branchId}
  ]);

  let data = resultSet?.recordset[0]?.current_value;  
  if (typeof data === 'undefined') {
    data = await createLatestRefNum(branchId);  
  }
  return data;
}

export async function incLatestRefNumber(branch: number) {
  let updateSql = `
    update imasterprofiles..AutoGenerateNumber
    set current_value = isnull(current_value, 0) + 1
    where ref_name = (select top 1 ltrim(rtrim(b.branch_code)) + '-PHYSICAL REF NUMBER-MOBILE' from imasterprofiles..branch b where b.branch_id = @branch_id)
  `;
  await query(updateSql, [
    {name: 'branch_id', type: sql.BigInt, value: branch}
  ]);
}

export async function getNextReferenceNumber() {
  let sql = `
    select case 
      when MAX(convert(int, ref_no)) is not null then MAX(convert(int, ref_no))+1 
      else 1 end as maxrefnum 
    from IMASTERDOCUMENTS..PhysicalH 
  `;
  let resultSet = await query(sql);
  return resultSet?.recordset[0];
}

export async function savePhysicalCount(data: PhysicalCount) {
  let insertSql = `
    insert into imasterdocuments..PhysicalH (
      branch_id, 
      ref_no, 
      trans_date, 
      supp_id, 
      remarks,
      total_amt, 
      prepared_id,
      approved_id, 
      prev_physical_id,
      branch_ref_no, 
      user_id, 
      posted,
      date_uploaded,
      date_created
    )
    values (
      @branch_id, 
      @ref_no, 
      @trans_date, 
      @supp_id, 
      @remarks,
      @total_amt, 
      @prepared_id,
      @approved_id, 
      @prev_physical_id,
      @branch_ref_no, 
      @user_id, 
      @posted,
      @date_uploaded,
      CURRENT_TIMESTAMP
    )
  `;

  const result = await query(insertSql, [
    {name: 'branch_id', type: sql.Int, value: data.branch_id||0}, 
    {name: 'ref_no', type: sql.Char(20), value: data?.ref_no.toString()||''}, 
    {name: 'trans_date', type: sql.Date, value: data.trans_date||new Date}, 
    {name: 'supp_id', type: sql.Int, value: data.supp_id||0}, 
    {name: 'remarks', type: sql.VarChar(200), value: data.remarks||''},
    {name: 'total_amt', type: sql.Decimal(10, 2), value: data.total_amt||0}, 
    {name: 'prepared_id', type: sql.SmallInt, value: data.prepared_id||0},
    {name: 'approved_id', type: sql.SmallInt, value: data.approved_id||0}, 
    {name: 'prev_physical_id', type: sql.Int, value: data.prev_physical_id||0},
    {name: 'branch_ref_no', type: sql.Char(10), value: data.branch_ref_no||''}, 
    {name: 'user_id', type: sql.Int, value: data.user_id||0}, 
    {name: 'posted', type: sql.TinyInt, value: data.posted},
    {name: 'date_uploaded', type: sql.Date, value: data.date_uploaded}, 
  ]);

  let insertId = result?.recordset[0].IDENTITY_ID;

  if (insertId && data.items) {
    data.items?.map(async (i: PhysicalCountItem) => {
      await savePhysicalCountItem({...i, ref_id: insertId});
      return i;
    })
  }

  if (data.branch_id) await incLatestRefNumber(data.branch_id);
}

export async function savePhysicalCountItem(data: PhysicalCountItem) {
    let insertSql = `
      insert into imasterdocuments..PhysicalD (
        ref_id, 
        barcode_id, 
        counted_qty,
        unit_id
      )
      values (
        @ref_id, 
        @barcode_id, 
        @counted_qty,
        @unit_id
      )
    `;

    await query(insertSql, [
      {name: 'ref_id', type: sql.BigInt, value: data.ref_id||0}, 
      {name: 'barcode_id', type: sql.Int, value: data.barcode_id||0}, 
      {name: 'counted_qty', type: sql.Decimal(11, 3), value: data.counted_qty||0},
      {name: 'unit_id', type: sql.Int, value: data.unit_id||0},
    ]);
}