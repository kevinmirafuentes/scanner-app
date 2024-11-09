import { StockTransferOut, StockTransferOutItem } from "@/types/types";
import { query } from "./db";
import sql from 'mssql';

export async function getNextReferenceNumber() {
  let querySql = `
    select case 
      when MAX(convert(int, ref_no)) is not null then MAX(convert(int, ref_no))+1 
      else 1 end as maxrefnum 
    from IMASTERDOCUMENTS..TransferOutH 
  `;
  let resultSet = await query(querySql);
  return resultSet?.recordset[0];
}

export async function saveStockTransferOut(data: StockTransferOut) {
  let insertSql = `
    insert into imasterdocuments..TransferOutH (
      source_branch_id, 
      ref_no,
      status,
      trans_date, 
      dest_branch_id,
      remarks, 
      total_qty,
      total_gross_amt,
      total_disc_amt,
      total_freight_amt,
      total_charges_amt,
      total_vat_amt,
      total_net_amt, 
      amt_paid, 
      balance,
      total_vatable_amt,
      total_non_vatable_amt, 
      user_id,
      posted,
      transfer_type, 
      cashier_id, 
      branch_ref_no,
      transfer_slip_no,
      date_created
    ) values (
      @source_branch_id, 
      @ref_no,
      @status,
      @trans_date, 
      @dest_branch_id,
      @remarks, 
      @total_qty,
      @total_gross_amt,
      @total_disc_amt,
      @total_freight_amt,
      @total_charges_amt,
      @total_vat_amt,
      @total_net_amt, 
      @amt_paid, 
      @balance,
      @total_vatable_amt,
      @total_non_vatable_amt, 
      @user_id,
      @posted,
      @transfer_type, 
      @cashier_id, 
      @branch_ref_no,
      @transfer_slip_no,
      CURRENT_TIMESTAMP
    )
  `;
  let insertResult = await query(insertSql, [
     {name: 'source_branch_id', type: sql.BigInt, value: data?.source_branch_id||0}, 
     {name: 'ref_no', type: sql.Char(10), value: data?.ref_no||''},
     {name: 'status', type: sql.Char(1), value: data?.status||''},
     {name: 'trans_date', type: sql.Date, value: data?.trans_date||new Date}, 
     {name: 'dest_branch_id', type: sql.BigInt, value: data?.dest_branch_id||0},
     {name: 'remarks', type: sql.VarChar(200), value: data?.remarks||''}, 
     {name: 'total_qty', type: sql.Numeric(10, 2), value: data?.total_qty||0},
     {name: 'total_gross_amt', type: sql.Numeric(10, 2), value: data?.total_gross_amt||0},
     {name: 'total_disc_amt', type: sql.Numeric(10, 2), value: data?.total_disc_amt||0},
     {name: 'total_freight_amt', type: sql.Numeric(10, 2), value: data?.total_freight_amt||0},
     {name: 'total_charges_amt', type: sql.Numeric(10, 2), value: data?.total_charges_amt||0},
     {name: 'total_vat_amt', type: sql.Numeric(10, 2), value: data?.total_vat_amt||0},
     {name: 'total_net_amt', type: sql.Decimal(10, 2), value: data?.total_net_amt||0}, 
     {name: 'amt_paid', type: sql.Decimal(10, 2), value: data?.amt_paid||0}, 
     {name: 'balance', type: sql.Decimal(10, 2), value: data?.balance||0},
     {name: 'total_vatable_amt', type: sql.Numeric(10, 2), value: data?.total_vatable_amt||0},
     {name: 'total_non_vatable_amt', type: sql.Numeric(10, 2), value: data?.total_non_vatable_amt||0}, 
     {name: 'user_id', type: sql.Int, value: data?.user_id||0},
     {name: 'posted', type: sql.TinyInt, value: data?.posted||0},
     {name: 'transfer_type', type: sql.Int, value: data?.transfer_type||0}, 
     {name: 'cashier_id', type: sql.Int, value: data?.cashier_id||0}, 
     {name: 'branch_ref_no', type: sql.Char(10), value: data?.branch_ref_no||null},
     {name: 'transfer_slip_no', type: sql.Char(10), value: data?.transfer_slip_no||null},
  ]);
  let insertId = insertResult?.recordset[0].IDENTITY_ID;

  if (insertId && data?.items) {
    data?.items?.map((i: StockTransferOutItem) => {
      saveStockTransferOutItem({ ...i, ref_id: insertId});
    })
  }
}

export async function saveStockTransferOutItem(data: StockTransferOutItem) {
  let insertSql = `
    insert into imasterdocuments..TransferOutD (
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
  let insertResult = await query(insertSql, [
    {name: 'ref_id', type: sql.BigInt, value: data?.ref_id||0},
    {name: 'barcode_id', type: sql.BigInt, value: data?.barcode_id||0}, 
    {name: 'qty', type: sql.Numeric(10, 3), value: data?.qty||0},
    {name: 'unit_id', type: sql.Int, value: data?.unit_id||0}, 
    {name: 'unit_price', type: sql.Decimal(12, 4), value: data?.unit_price||0},
    {name: 'gross_amt', type: sql.Numeric(10, 2), value: data?.gross_amt||0},
    {name: 'base_qty', type: sql.Numeric(10, 2), value: data?.base_qty||0},
    {name: 'disc_id1', type: sql.Int, value: data?.disc_id1||0},
    {name: 'disc_id2', type: sql.Int, value: data?.disc_id2||0},
    {name: 'disc_id3', type: sql.Int, value: data?.disc_id3||0},
    {name: 'disc_id4', type: sql.Int, value: data?.disc_id4||0},
    {name: 'disc_id5', type: sql.Int, value: data?.disc_id5||0},
    {name: 'disc_id6', type: sql.Int, value: data?.disc_id6||0},
    {name: 'disc_id7', type: sql.Int, value: data?.disc_id7||0},
    {name: 'disc_id8', type: sql.Int, value: data?.disc_id8||0},
    {name: 'disc_amt', type: sql.Numeric(10, 2), value: data?.disc_amt||0},
    {name: 'freight_id', type: sql.Int, value: data?.freight_id||0},
    {name: 'freight_amt', type: sql.Decimal(10, 2), value: data?.freight_amt||0},
    {name: 'charges_id', type: sql.Int, value: data?.charges_id||0},
    {name: 'charges_amt', type: sql.Decimal(10, 2), value: data?.charges_amt||0},
    {name: 'net_amt', type: sql.Numeric(10, 2), value: data?.net_amt||0}, 
    {name: 'total_cost', type: sql.Numeric(10, 2), value: data?.total_cost||0},
  ]);
}