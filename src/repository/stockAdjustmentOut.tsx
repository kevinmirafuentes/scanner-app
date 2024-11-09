import { StockAdjustmentInItem, StockAdjustmentOut, StockAdjustmentOutItem } from "@/types/types";
import { query } from "./db";
import sql from 'mssql';

export async function getNextReferenceNumber() {
  let querySql = `
    select case 
      when MAX(convert(int, adj_no)) is not null then MAX(convert(int, adj_no))+1 
      else 1 end as maxrefnum 
    from IMASTERDOCUMENTS..AdjustmentOutH 
  `;
  let resultSet = await query(querySql);
  return resultSet?.recordset[0];
}

export async function saveStockAdjustmentOut(data: StockAdjustmentOut) {
  let insertSql = `
    insert into imasterdocuments..AdjustmentOutH (
      branch_id, 
      adj_no, 
      status, 
      trans_date, 
      remarks, 
      total_qty, 
      total_net_amt, 
      user_id, 
      posted, 
      branch_ref_no, 
      date_created
    )
    values (
      @branch_id, 
      @adj_no, 
      @status, 
      @trans_date, 
      @remarks, 
      @total_qty, 
      @total_net_amt, 
      @user_id, 
      @posted, 
      @branch_ref_no, 
      CURRENT_TIMESTAMP
    )
  `;
  let result = await query(insertSql, [
    {name: 'branch_id', type: sql.BigInt, value: data?.branch_id}, 
    {name: 'adj_no', type: sql.Char(10), value: data?.adj_no}, 
    {name: 'status', type: sql.Char(1), value: data?.status}, 
    {name: 'trans_date', type: sql.DateTime, value: data?.trans_date}, 
    {name: 'remarks', type: sql.VarChar(200), value: data?.remarks}, 
    {name: 'total_qty', type: sql.Decimal(10, 2), value: data?.total_qty||0}, 
    {name: 'total_net_amt', type: sql.Decimal(10, 2), value: data?.total_net_amt||0}, 
    {name: 'user_id', type: sql.Int, value: data?.user_id}, 
    {name: 'posted', type: sql.TinyInt, value: data?.posted}, 
    {name: 'branch_ref_no', type: sql.Char(10), value: data?.branch_ref_no}, 
  ]);
  let insertId = result?.recordset[0].IDENTITY_ID; 
  if (insertId && data?.items) {
    data?.items?.map((i: StockAdjustmentInItem) => {
      saveStockAdjustmentOutItem({ ...i, adj_id: insertId});
    })
  }
}

export async function saveStockAdjustmentOutItem(data: StockAdjustmentOutItem) {
  let insertSql = `
    insert into imasterdocuments..AdjustmentOutD (
      adj_id, 
      barcode_id, 
      qty, 
      unit_id, 
      unit_price,
      base_qty, 
      net_amt
    )
    values (
      @adj_id, 
      @barcode_id, 
      @qty, 
      @unit_id, 
      @unit_price,
      @base_qty, 
      @net_amt
    )
  `;
  await query(insertSql, [
    {name: 'adj_id', type: sql.BigInt, value: data?.adj_id}, 
    {name: 'barcode_id', type: sql.BigInt, value: data?.barcode_id}, 
    {name: 'qty', type: sql.Numeric(10, 3), value: data?.qty||0}, 
    {name: 'unit_id', type: sql.Int, value: data?.unit_id||0}, 
    {name: 'unit_price', type: sql.Decimal(12, 4), value: data?.unit_price||0},
    {name: 'base_qty', type: sql.Numeric(10, 2), value: data?.base_qty||0}, 
    {name: 'net_amt', type: sql.Decimal(12, 4), value: data?.net_amt||0},
  ]);
}