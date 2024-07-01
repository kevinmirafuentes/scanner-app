import { query } from "@/repository/db"
import { StoreStockRequest } from "@/types/types";
import sql from 'mssql';
import { stockRequestDTO } from "./dto";

export async function saveStockRequest(stockRequest: StoreStockRequest) {
  let stockRequestSql = `
    insert into imasterdocuments..StoreStockRequestH
    (ref_no, trans_date, remarks, request_status, user_id, date_created)
    values 
    (@refNo, @transDate, @remarks, @requestStatus, @userId, CURRENT_TIMESTAMP)
  `
  let stockRequestInsertResult = await query(stockRequestSql, [
    {name: 'refNo', type: sql.Char(10), value: stockRequest.ref_no},
    {name: 'transDate', type: sql.DateTime, value: stockRequest.trans_date},
    {name: 'remarks', type: sql.VarChar(100), value: stockRequest.remarks},
    {name: 'requestStatus', type: sql.Char(1), value: stockRequest.request_status},
    {name: 'userId', type: sql.Int, value: stockRequest.user.user_id},
  ]);

  let stockRequestId = stockRequestInsertResult?.recordset[0].IDENTITY_ID;
  if (stockRequestId) {
    let itemsValueParts = [];

    for (let i = 0; i < stockRequest.items.length; i++) {
      itemsValueParts.push(`(
        @refId, 
        @barcodeId${i},
        @qty${i} 
      )`);
    }

    let stockRequestItemSql = `
      insert into imasterdocuments..StoreStockRequestD (
        ref_id, 
        barcode_id, 
        qty
      )
      values ${itemsValueParts.join(',')}
    `;

    let itemsQueryParams = [
      {name: 'refId', type: sql.BigInt, value: stockRequestId}
    ];

    for (let a = 0; a < stockRequest.items.length; a++) {
      itemsQueryParams.push({name: 'barcodeId'+a, type: sql.BigInt, value: stockRequest.items[a].barcode_id});
      itemsQueryParams.push({name: 'qty'+a, type: sql.BigInt, value: stockRequest.items[a].qty});
    }

    await query(stockRequestItemSql, itemsQueryParams);

    return getStockRequestById(stockRequestId)
  }
  return null;
};

export async function getStockRequestById(id: number) {
  let queryString = `
    select top 1 
      ref_id, 
      ref_no, 
      trans_date, 
      request_status, 
      user_id, 
      time_stamp, 
      date_created 
    from imasterdocuments..StoreStockRequestH
    where ref_id = '${id}'
  `;
  let resultSet = await query(queryString);
  let data = resultSet?.recordset[0];  
  return await stockRequestDTO(data);
}

export async function getStockRequestItems(refId: number) {
  let queryString = `
    select 
      ref_id, 
      barcode_id, 
      qty, 
      auto_id 
    from imasterdocuments..StoreStockRequestD 
    where ref_id = '${refId}'
  `;
  let resultSet = await query(queryString);
  return resultSet?.recordsets;
}

export async function getStockRequestsByDate(date: Date) {
  let queryString = `
    select 
      ref_id, 
      ref_no, 
      trans_date, 
      remarks, 
      request_status,
      date_created
    from imasterdocuments..StoreStockRequestH
    where datediff(day, date_created, @date) = 0
  `;
  let resultSet = await query(queryString, [
    {name: 'date', type: sql.DateTime, value: date}
  ]);
  return resultSet?.recordset; 
}