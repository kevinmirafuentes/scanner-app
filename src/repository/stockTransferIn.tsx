import { StockTransferIn, StockTransferInItem } from "@/types/types";
import { query } from "./db";
import sql from 'mssql';

const autoGenerateSuffix = 'TRANSFERINNUMBER-MOBILE';

export async function getNextReferenceNumber() {
  let querySql = `
    select case 
      when MAX(convert(int, ref_no)) is not null then MAX(convert(int, ref_no))+1 
      else 1 end as maxrefnum 
    from IMASTERDOCUMENTS..TransferInH 
  `;
  let resultSet = await query(querySql);
  return resultSet?.recordset[0];
}

export async function getLatestRefNumber(branchId: number) {
  let querySql = `
    select current_value 
    from imasterprofiles..AutoGenerateNumber 
    where ref_name=(select top 1 ltrim(rtrim(b.branch_code)) + '-${autoGenerateSuffix}' from imasterprofiles..branch b where b.branch_id = @branch_id)
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

const createLatestRefNum = async (branchId: number) => {
  let insertSql = `
    insert into imasterprofiles..AutoGenerateNumber (
      ref_name,
      current_value
    ) 
    select 
      ltrim(rtrim(b.branch_code)) + '-${autoGenerateSuffix}' as ref_name,
      1 as current_value
    from imasterprofiles..branch b where b.branch_id = @branch_id
  `;
  await query(insertSql, [
    {name: 'branch_id', type: sql.BigInt, value: branchId},
  ]);
  return 1;
};

export async function incLatestRefNumber(branch: number) {
  let updateSql = `
    update imasterprofiles..AutoGenerateNumber
    set current_value = isnull(current_value, 0) + 1
    where ref_name = (select top 1 ltrim(rtrim(b.branch_code)) + '-${autoGenerateSuffix}' from imasterprofiles..branch b where b.branch_id = @branch_id)
  `;
  await query(updateSql, [
    {name: 'branch_id', type: sql.BigInt, value: branch}
  ]);

}

export async function saveStockTransferIn(data: StockTransferIn) {
  console.log(data);
  let insertSql = `
    insert into imasterdocuments..TransferInH (
      branch_id, 
      ref_no,
      status, 
      trans_date,
      source_branch_id, 
      transfer_out_ref_no,
      remarks, 
      total_qty,
      total_freight_amt, 
      total_disc_amt, 
      total_charges_amt,
      total_gross_amt,
      total_vat_amt,
      total_net_amt,
      amt_paid,
      balance,
      total_vatable_amt,
      total_non_vatable_amt,
      user_id,
      posted,
      branch_ref_no,
      transfer_slip_no,
      date_created,
      date_uploaded
    ) 
    values (
      @branch_id, 
      @ref_no,
      @status, 
      @trans_date,
      @source_branch_id, 
      @transfer_out_ref_no,
      @remarks, 
      @total_qty,
      @total_freight_amt, 
      @total_disc_amt, 
      @total_charges_amt,
      @total_gross_amt,
      @total_vat_amt,
      @total_net_amt,
      @amt_paid,
      @balance,
      @total_vatable_amt,
      @total_non_vatable_amt,
      @user_id,
      @posted,
      @branch_ref_no,
      @transfer_slip_no,
      CURRENT_TIMESTAMP,
      '1900-01-01'
    )
  `;

  let stockTransferInResult = await query(insertSql, [
        {name: 'branch_id', type: sql.Int, value: data?.branch_id||0}, 
        {name: 'ref_no', type: sql.Char(10), value: data?.ref_no||0},
        {name: 'status', type: sql.Char(1), value: data?.status||''}, 
        {name: 'trans_date', type: sql.Date, value: data?.trans_date||new Date()},
        {name: 'source_branch_id', type: sql.Int, value: data?.source_branch_id||0}, 
        {name: 'transfer_out_ref_no', type: sql.Char(10), value: data?.transfer_out_ref_no||''},
        {name: 'remarks', type: sql.VarChar(255), value: data?.remarks||''}, 
        {name: 'total_qty', type: sql.Decimal(10, 2), value: data?.total_qty||0},
        {name: 'total_freight_amt', type: sql.Decimal(10, 2), value: data?.total_freight_amt||0}, 
        {name: 'total_disc_amt', type: sql.Decimal(10, 2), value: data?.total_disc_amt||0}, 
        {name: 'total_charges_amt', type: sql.Decimal(10, 2), value: data?.total_charges_amt||0},
        {name: 'total_gross_amt', type: sql.Decimal(10, 2), value: data?.total_gross_amt||0},
        {name: 'total_vat_amt', type: sql.Decimal(10, 2), value: data?.total_vat_amt||0},
        {name: 'total_net_amt', type: sql.Decimal(10, 2), value: data?.total_net_amt||0},
        {name: 'amt_paid', type: sql.Decimal(10, 2), value: data?.amt_paid||0},
        {name: 'balance', type: sql.Decimal(10, 2), value: data?.balance},
        {name: 'total_vatable_amt', type: sql.Decimal(10, 2), value: data?.total_vatable_amt||0},
        {name: 'total_non_vatable_amt', type: sql.Decimal(10, 2), value: data.total_non_vatable_amt||0},
        {name: 'user_id', type: sql.Int, value: data?.user_id},
        {name: 'posted', type: sql.TinyInt, value: data?.posted||0},
        {name: 'branch_ref_no', type: sql.Char(10), value: data?.branch_ref_no},
        {name: 'transfer_slip_no', type: sql.Char(10), value: data?.transfer_slip_no},
  ]);

  let insertId = stockTransferInResult?.recordset[0].IDENTITY_ID;
  
  console.log('last insert id', insertId);

  if (insertId && data.items) {
    data.items?.map((i: StockTransferInItem) => saveStockTransferInItem({...i, ref_id: insertId}))
  }

  if (data.branch_id) await incLatestRefNumber(data.branch_id);

}

export async function saveStockTransferInItem(item: StockTransferInItem) {
    let insertSql = `
      insert into imasterdocuments..TransferInD (
        ref_id, 
        barcode_id, 
        qty, 
        unit_id,
        unit_price,
        gross_amt,
        base_qty,
        disc_id1, 
        disc_id2,
        disc_id3, 
        disc_id4,
        disc_id5,
        disc_id6, 
        disc_id7, 
        disc_id8,
        disc_amt,
        freight_id, 
        freight_amt,
        charges_id, 
        charges_amt, 
        net_amt, 
        total_cost
      )
      values (
        @ref_id, 
        @barcode_id, 
        @qty, 
        @unit_id,
        @unit_price,
        @gross_amt,
        @base_qty,
        @disc_id1, 
        @disc_id2,
        @disc_id3, 
        @disc_id4,
        @disc_id5,
        @disc_id6, 
        @disc_id7, 
        @disc_id8,
        @disc_amt,
        @freight_id, 
        @freight_amt,
        @charges_id, 
        @charges_amt, 
        @net_amt, 
        @total_cost
      )
    `;

    await query(insertSql, [
      {name: 'ref_id', type: sql.Int, value: item.ref_id||0}, 
      {name: 'barcode_id', type: sql.Int, value: item.barcode_id||0}, 
      {name: 'qty', type: sql.Int, value: item.qty||0}, 
      {name: 'unit_id', type: sql.Int, value: item.unit_id||0},
      {name: 'unit_price', type: sql.Decimal(12, 4), value: item.unit_price||0},
      {name: 'gross_amt', type: sql.Decimal(10, 2), value: item.gross_amt||0},
      {name: 'base_qty', type: sql.Decimal(10, 2), value: item.base_qty||0},
      {name: 'disc_id1', type: sql.Int, value: item.disc_id1||0}, 
      {name: 'disc_id2', type: sql.Int, value: item.disc_id2||0}, 
      {name: 'disc_id3', type: sql.Int, value: item.disc_id3||0},  
      {name: 'disc_id4', type: sql.Int, value: item.disc_id4||0}, 
      {name: 'disc_id5', type: sql.Int, value: item.disc_id5||0}, 
      {name: 'disc_id6', type: sql.Int, value: item.disc_id6||0},  
      {name: 'disc_id7', type: sql.Int, value: item.disc_id7||0},  
      {name: 'disc_id8', type: sql.Int, value: item.disc_id8||0}, 
      {name: 'disc_amt', type: sql.Decimal(10, 2), value: item.disc_amt||0},
      {name: 'freight_id', type: sql.Int, value: item.freight_id||0}, 
      {name: 'freight_amt', type: sql.Decimal(10, 2), value: item.freight_amt||0},
      {name: 'charges_id', type: sql.Int, value: item.charges_id||0}, 
      {name: 'charges_amt', type: sql.Decimal(10, 2), value: item.charges_amt||0}, 
      {name: 'net_amt', type: sql.Decimal(10, 2), value: item.net_amt||0}, 
      {name: 'total_cost', type: sql.Decimal(10, 2), value: item.total_cost||0}, 
    ]);
}