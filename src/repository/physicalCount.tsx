import { PhysicalCount, PhysicalCountItem } from "@/types/types";
import { query } from "./db";
import sql from 'mssql';
import moment from "moment";
import { time } from "console";

export async function getLatestRefNumber(branch: string|number) {
  let sql = `
    select 
      current_value 
    from 
      imasterprofiles..AutoGenerateNumber 
    where 
      ref_name='${branch}-PHYSICAL REF NUMBER'
  `;
  let resultSet = await query(sql);
  let data = resultSet?.recordset[0]?.current_value;  
  return data;
}

export async function getNextReferenceNumber() {
  let sql = `
    select case 
      when MAX(convert(int, ref_no)) is not null then MAX(convert(int, ref_no))+1 
      else 1 end as maxrefnum 
    from IMASTERDOCUMENTS..BadorderH 
  `;
  let resultSet = await query(sql);
  return resultSet?.recordset[0];
}

export async function savePhysicalCount(physicalCount: PhysicalCount) {
  let insertSql = `
    insert into imasterdocuments..BadorderH (
      branch_id, 
      ref_no,
      supp_id, 
      trans_date,
      status,
      return_slip_no,
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
      date_created
    )
    values 
    (
      @branchId,
      @refNo, 
      @suppId, 
      @transDate,
      @status,
      @returnSlipNo,
      @remarks,
      @totalQty,
      @totalGrossAmt,
      @totalDiscAmt,
      @totalFreightAmt,
      @totalChargesAmt,
      @totalVatAmt,
      @totalNetAmt,
      @amtPaid,
      @balance,
      @totalVatableAmt,
      @totalNonVatableAmt,
      @userId,
      CURRENT_TIMESTAMP
    )
  `;
  
  let physicalCountInsertResult = await query(insertSql, [
    {name: 'branchId', type: sql.Int, value: physicalCount.branch_id},
    {name: 'refNo', type: sql.Int, value: physicalCount.ref_no},
    {name: 'suppId', type: sql.Int, value: physicalCount.supp_id},
    {name: 'transDate', type: sql.Date, value: physicalCount.date},
    {name: 'status', type: sql.Char, value: physicalCount.status},
    {name: 'returnSlipNo', type: sql.Int, value: physicalCount.return_slip_no},
    {name: 'remarks', type: sql.Int, value: physicalCount.remarks},
    {name: 'totalQty', type: sql.Int, value: physicalCount.total_qty},
    {name: 'totalGrossAmt', type: sql.Decimal(10, 2), value: physicalCount.total_gross_amt||0},
    {name: 'totalDiscAmt', type: sql.Decimal(10, 2), value: physicalCount.total_disc_amt||0},
    {name: 'totalFreightAmt', type: sql.Decimal(10, 2), value: physicalCount.total_freight_amt||0},
    {name: 'totalChargesAmt', type: sql.Decimal(10, 2), value: physicalCount.total_charges_amt||0},
    {name: 'totalVatAmt', type: sql.Decimal(10, 2), value: physicalCount.total_vat_amt||0},
    {name: 'totalNetAmt', type: sql.Decimal(10, 2), value: physicalCount.total_net_amt||0},
    {name: 'amtPaid', type: sql.Decimal(10, 2), value: physicalCount.amt_paid||0},
    {name: 'balance', type: sql.Decimal(10, 2), value: physicalCount.balance||0},
    {name: 'totalVatableAmt', type: sql.Decimal(10, 2), value: physicalCount.total_vat_amt||0},
    {name: 'totalNonVatableAmt', type: sql.Decimal(10, 2), value: physicalCount.total_non_vatable_amt||0},
    {name: 'userId', type: sql.Int, value: physicalCount.user_id}
  ]);

  let physicalCountId = physicalCountInsertResult?.recordset[0].IDENTITY_ID;
  console.log('insert id', physicalCountId)
  if (physicalCountId && physicalCount.items) {
    physicalCount.items?.map((i: PhysicalCountItem) => {
      i.ref_id = physicalCountId;
      savePhysicalCountItem(i);
      return i;
    })
  }
}

export async function savePhysicalCountItem(item: PhysicalCountItem) {
    let insertSql = `
      insert into imasterdocuments..BadorderD (
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
        disc_amt,
        prorated_disc_amt,
        freight_id, 
        freight_amt,
        charges_id, 
        charges_amt,
        net_amt,
        total_cost
      )
      values (
        @refId,
        @barcodeId,
        @qty,
        @unitId,
        @unitPrice,
        @grossAmt,
        @baseQty,
        @discId1,
        @discId2,
        @discId3,
        @discId4,
        @discId5, 
        @discAmt,
        @proratedDiscAmt,
        @freightId,
        @freightAmt,
        @chargesId,
        @chargesAmt,
        @netAmt,
        @totalCost
      )
    `;

    await query(insertSql, [
      {name: 'refId', type: sql.Int, value: item.ref_id},
      {name: 'barcodeId', type: sql.Int, value: item.ref_id},
      {name: 'qty', type: sql.Int, value: item.qty},
      {name: 'unitId', type: sql.Int, value: item.unit_id||0},
      {name: 'unitPrice', type: sql.Decimal(12, 4), value: item.unit_price||0},
      {name: 'grossAmt', type: sql.Decimal(10, 2), value: item.gross_amt||0},
      {name: 'baseQty', type: sql.Int , value: item.base_qty||0},
      {name: 'discId1', type: sql.Int, value: item.disc_id1||0},
      {name: 'discId2', type: sql.Int, value: item.disc_id2||0},
      {name: 'discId3', type: sql.Int, value: item.disc_id3||0},
      {name: 'discId4', type: sql.Int, value: item.disc_id4||0},
      {name: 'discId5', type: sql.Int, value: item.disc_id5||0}, 
      {name: 'discAmt', type: sql.Decimal(10, 2), value: item.disc_amt||0},
      {name: 'proratedDiscAmt', type: sql.Decimal(10, 2), value: item.prorated_disc_amt||0},
      {name: 'freightId', type: sql.Int, value: item.freight_id||0},
      {name: 'freightAmt', type: sql.Decimal(10, 2), value: item.freight_amt||0},
      {name: 'chargesId', type: sql.Int, value: item.charges_id||0},
      {name: 'chargesAmt', type: sql.Decimal(10, 2), value: item.charges_amt||0},
      {name: 'netAmt', type: sql.Decimal(10, 2), value: item.net_amt||0},
      {name: 'totalCost', type: sql.Decimal(10, 2), value: item.total_cost||0}
    ]);
}