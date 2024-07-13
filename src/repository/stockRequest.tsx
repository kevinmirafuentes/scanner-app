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
    {name: 'userId', type: sql.Int, value: stockRequest.user?.user_id},
  ]);

  let stockRequestId = stockRequestInsertResult?.recordset[0].IDENTITY_ID;
  if (stockRequestId) {
    let itemsValueParts = [];

    // @ts-ignore
    for (let i = 0; i < stockRequest?.items.length; i++) {
      itemsValueParts.push(`(
        @refId, 
        @barcodeId${i},
        @qty${i},
        @requestStatus${i} 
      )`);
    }

    let stockRequestItemSql = `
      insert into imasterdocuments..StoreStockRequestD (
        ref_id, 
        barcode_id, 
        qty,
        request_status
      )
      values ${itemsValueParts.join(',')}
    `;

    let itemsQueryParams = [
      {name: 'refId', type: sql.BigInt, value: stockRequestId}
    ];

    // @ts-ignore
    for (let a = 0; a < stockRequest?.items.length; a++) {
      // @ts-ignore
      itemsQueryParams.push({name: 'barcodeId'+a, type: sql.BigInt, value: stockRequest.items[a].barcode_id});
      // @ts-ignore
      itemsQueryParams.push({name: 'qty'+a, type: sql.BigInt, value: stockRequest.items[a].qty});
      // @ts-ignore
      itemsQueryParams.push({name: 'requestStatus'+a, type: sql.Char(1), value: 'P'});
    }

    await query(stockRequestItemSql, itemsQueryParams);

    return getStockRequestById(stockRequestId)
  }
  return null;
};

export async function getStockRequestById(id: string) {
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
      s.ref_id, 
      s.barcode_id, 
      b.barcode,
      s.qty, 
      s.auto_id,
      s.request_status,
      p.long_descript as name,
      st.qty_on_hand as inv,
      u.unit_code as uom,
      h.remarks
    from imasterdocuments..StoreStockRequestD s 
    inner join imasterdocuments..StoreStockRequestH h on h.ref_id = s.ref_id
    inner join imasterprofiles..BarcodeH b on b.barcode_id = s.barcode_id 
    inner join imasterprofiles..Product p on p.product_id = b.product_id
    left join imasterprofiles..Unit u on u.unit_id = b.unit_id 
    left join imasterprofiles..Stocks st on st.product_id = p.product_id
    where s.ref_id = '${refId}'
  `;
  let resultSet = await query(queryString);
  return resultSet?.recordset;
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

  let results = [];
  for (let i=0; i<resultSet?.recordset.length; i++) {
    let res: any = resultSet?.recordset[i];
    let itemResultSet = await getStockRequestItems(res.ref_id);
    results.push({...res, items: itemResultSet});
  }

  return results; 
}

export async function updateStockRequestItemStatus(id: number, status: string) {
  let updateSql = `
    update imasterdocuments..StoreStockRequestD set request_status=@status where auto_id=@id
  `;
  await query(updateSql, [
    {name: 'status', type: sql.Char(1), value: status},
    {name: 'id', type: sql.BigInt, value: id}
  ]);
}