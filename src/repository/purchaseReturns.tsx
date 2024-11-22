import { PurchaseReturn, PurchaseReturnItem } from "@/types/types";
import { query } from "./db";
import sql from 'mssql';
import { purchaseReturnDTO } from "./dto";

const autoGenerateSuffix = 'BADORDERNUMBER-MOBILE';

export async function getNextReferenceNumber() {
  let sql = `
  select case 
    when MAX(convert(int, ref_no)) is not null then MAX(convert(int, ref_no))+1 
    else 1 end as maxrefnum 
  from IMASTERDOCUMENTS..BadOrderH 
`;
  let resultSet = await query(sql);
  return resultSet?.recordset[0];
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

export async function savePurchaseReturn(data: PurchaseReturn) {
  let insertSql = `
    insert into imasterdocuments..BadorderH (
      branch_id,
      ref_no,
      status,
      trans_date,
      supp_id,
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
      disc_id1,
      disc_id2,
      disc_id3,
      disc_id4,
      disc_id5,
      user_id,
      posted,
      vat_price_indicator,
      branch_ref_no,
      distributor_id,
      date_created,
      date_uploaded
    )
    values (
      @branch_id,
      @ref_no,
      @status,
      @trans_date,
      @supp_id,
      @return_slip_no,
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
      @disc_id1,
      @disc_id2,
      @disc_id3,
      @disc_id4,
      @disc_id5,
      @user_id,
      @posted,
      @vat_price_indicator,
      @branch_ref_no,
      @distributor_id,
      CURRENT_TIMESTAMP,
      '1900-01-01'
    )
  `;

  const result = await query(insertSql, [
    {name: 'branch_id', type: sql.BigInt, value: data.branch_id||0},
    {name: 'ref_no', type: sql.Char(10), value: data.ref_no?.toString()},
    {name: 'status', type: sql.Char(1), value: data.status||''},
    {name: 'trans_date', type: sql.Date, value: data.trans_date},
    {name: 'supp_id', type: sql.Int, value: data.supp_id||0},
    {name: 'return_slip_no', type: sql.Int, value: data.return_slip_no||0},
    {name: 'remarks', type: sql.VarChar(200), value: data.remarks||''},
    {name: 'total_qty', type: sql.Decimal(10, 2), value: data.total_qty||0},
    {name: 'total_gross_amt', type: sql.Decimal(10, 2), value: data.total_gross_amt||0},
    {name: 'total_disc_amt', type: sql.Decimal(10, 2), value: data.total_disc_amt||0},
    {name: 'total_freight_amt', type: sql.Decimal(10, 2), value: data.total_freight_amt||0},
    {name: 'total_charges_amt', type: sql.Decimal(10, 2), value: data.total_charges_amt||0},
    {name: 'total_vat_amt', type: sql.Decimal(10, 2), value: data.total_vat_amt||0},
    {name: 'total_net_amt', type: sql.Decimal(10, 2), value: data.total_net_amt||0},
    {name: 'amt_paid', type: sql.Decimal(10, 2), value: data.amt_paid||0},
    {name: 'balance', type: sql.Decimal(10, 2), value: data.balance||0},
    {name: 'total_vatable_amt', type: sql.Decimal(10, 2), value: data.total_vatable_amt||0},
    {name: 'total_non_vatable_amt', type: sql.Decimal(10, 2), value: data.total_non_vatable_amt||0},
    {name: 'disc_id1', type: sql.Int, value: data.disc_id1||0},
    {name: 'disc_id2', type: sql.Int, value: data.disc_id2||0},
    {name: 'disc_id3', type: sql.Int, value: data.disc_id3||0},
    {name: 'disc_id4', type: sql.Int, value: data.disc_id4||0},
    {name: 'disc_id5', type: sql.Int, value: data.disc_id5||0},
    {name: 'user_id', type: sql.Int, value: data.user_id||0},
    {name: 'posted', type: sql.Int, value: data.posted||null},
    {name: 'vat_price_indicator', type: sql.Int, value: data.vat_price_indicator||null},
    {name: 'branch_ref_no', type: sql.Char(10), value: data.branch_ref_no?.toString()||null},
    {name: 'distributor_id', type: sql.Int, value: data.distributor_id||null},
  ]);

  let insertId = result?.recordset[0].IDENTITY_ID;

  console.log('last purchase return id: ' + insertId);

  if (insertId && data.items) {
    data.items?.map((i: PurchaseReturnItem) => savePurchaseReturnItem({...i, ref_id: insertId}))
  }

  // @TODO: update total fields with SUM from badorderD
  if (data.branch_id) await incLatestRefNumber(data.branch_id);

  return await getPurchaseReturnById(insertId);
}

export async function getPurchaseReturnById(id: number): Promise<PurchaseReturn> {
  let queryString = `
    select top 1 
      * 
    from imasterdocuments..BadOrderH
    where ref_id = @ref_id
  `;
  let resultSet = await query(queryString, [
    {name: 'ref_id', type: sql.BigInt, value: id}
  ]);

  let data = resultSet?.recordset[0];  
  return await purchaseReturnDTO(data);
}

export async function getPurchaseReturnItems(refId: number): Promise<PurchaseReturnItem[]> {
  let queryString = `
    select top 1 
      d.*,
      u.unit_code,
      p.short_descript as product_name
    from imasterdocuments..BadOrderD d
    inner join imasterprofiles..Unit u on u.unit_id = d.unit_id
    inner join imasterprofiles..BarcodeH bc on bc.barcode_id = d.barcode_id
    inner join imasterprofiles..Product p on p.product_id = bc.product_id
    where ref_id = @ref_id
  `;
  let resultSet = await query(queryString, [
    {name: 'ref_id', type: sql.BigInt, value: refId}
  ]);
  return resultSet?.recordset;
}

export async function savePurchaseReturnItem(data: PurchaseReturnItem) {
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
      @disc_amt, 
      @prorated_disc_amt,
      @freight_id, 
      @freight_amt, 
      @charges_id, 
      @charges_amt, 
      @net_amt, 
      @total_cost
    )
  `;

  await query(insertSql, [
    {name: 'ref_id', type: sql.BigInt, value: data.ref_id||0},
    {name: 'barcode_id', type: sql.BigInt, value: data.barcode_id||0}, 
    {name: 'qty', type: sql.Decimal(10, 3), value: data.qty||0}, 
    {name: 'unit_id', type: sql.Int, value: data.unit_id||0}, 
    {name: 'unit_price', type: sql.Decimal(10, 2), value: data.unit_price||0},
    {name: 'gross_amt', type: sql.Numeric(10, 2), value: data.gross_amt||0},
    {name: 'base_qty', type: sql.Numeric(10, 2), value: data.base_qty||0},
    {name: 'disc_id1', type: sql.Int, value: data.disc_id1||0}, 
    {name: 'disc_id2', type: sql.Int, value: data.disc_id2||0},  
    {name: 'disc_id3', type: sql.Int, value: data.disc_id3||0}, 
    {name: 'disc_id4', type: sql.Int, value: data.disc_id4||0}, 
    {name: 'disc_id5', type: sql.Int, value: data.disc_id5||0}, 
    {name: 'disc_amt', type: sql.Numeric(10, 2), value: data.disc_amt||0}, 
    {name: 'prorated_disc_amt', type: sql.Numeric(10, 2), value: data.prorated_disc_amt||0},
    {name: 'freight_id', type: sql.Int, value: data.freight_id||0}, 
    {name: 'freight_amt', type: sql.Decimal(10, 2), value: data.freight_amt||0}, 
    {name: 'charges_id', type: sql.Int, value: data.charges_id||0}, 
    {name: 'charges_amt', type: sql.Decimal(10, 2), value: data.charges_amt||0}, 
    {name: 'net_amt', type: sql.Numeric(10, 2), value: data.net_amt||0}, 
    {name: 'total_cost', type: sql.Decimal(10, 2), value: data.total_cost||0},
  ]);
}