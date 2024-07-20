import { TagRequest, TagRequestItem } from "@/types/types";
import sql from 'mssql';
import { query } from "./db";
import { tagRequestDTO } from "./dto";

export async function saveTagRequest(tagRequest: TagRequest) {
  let tagRequestSql = `
    insert into imasterdocuments..StoreTagRequestH
    (user_id, date_created)
    values 
    (@userId, CURRENT_TIMESTAMP)
  `

  let tagRequestInsertResult = await query(tagRequestSql, [
    {name: 'userId', type: sql.Int, value: tagRequest.user?.user_id},
  ]);

  let tagRequestId = tagRequestInsertResult?.recordset[0].IDENTITY_ID;
  
  if (!tagRequestId) {
    return null;
  }
  
  let itemsValueParts: string[] = [];
    let itemsQueryParams = [];

    itemsQueryParams.push({name: 'refId', type: sql.BigInt, value: tagRequestId});

    // @ts-ignore
    tagRequest.items.map((value: TagRequestItem, index: number) => {
      itemsValueParts.push(`(
        @refId, 
        @barcodeId${index},
        @qty${index}
      )`);
      
      // @ts-ignore
      itemsQueryParams.push({name: `barcodeId${index}`, type: sql.BigInt, value: value.barcode_id});
      // @ts-ignore
      itemsQueryParams.push({name: `qty${index}`, type: sql.BigInt, value: value.qty});
    })

    let tagRequestItemSql = `
      insert into imasterdocuments..StoreTagRequestD (
        ref_id, 
        barcode_id, 
        qty
      )
      values ${itemsValueParts.join(',')}
    `;

    await query(tagRequestItemSql, itemsQueryParams);

    return getTagRequestById(tagRequestId)
};

export async function getTagRequestById(id: string, branchId?:number) {
  let queryString = `
    select top 1 
      ref_id, 
      user_id, 
      date_created
    from imasterdocuments..StoreTagRequestH
    where ref_id = '${id}'
  `;
  let resultSet = await query(queryString);
  let data = resultSet?.recordset[0];  
  return await tagRequestDTO(data, branchId);
}

export async function getTagRequestItems(refId: number, branchId?: number) {
  let queryString = `
    select 
      s.ref_id, 
      s.barcode_id, 
      b.barcode,
      s.qty, 
      s.auto_id,
      p.long_descript as name,
      d.retail_selling_price as retail_unit_price
    from imasterdocuments..StoreTagRequestD s 
    inner join imasterdocuments..StoreTagRequestH h on h.ref_id = s.ref_id
    inner join imasterprofiles..BarcodeH b on b.barcode_id = s.barcode_id
    inner join imasterprofiles..BarcodeD d on d.barcode_id = b.barcode_id 
    inner join imasterprofiles..Product p on p.product_id = b.product_id
    where s.ref_id = '${refId}'
    and d.branch_id = '${branchId || 0}'
  `;
  let resultSet = await query(queryString);
  return resultSet?.recordset;
}

export async function getTagRequestsByDate(date: Date, branchId: number) {
  let queryString = `
    select 
      ref_id, 
      date_created
    from imasterdocuments..StoreTagRequestH
    where datediff(day, date_created, @date) = 0
    order by ref_id asc
  `;
  let resultSet = await query(queryString, [
    {name: 'date', type: sql.DateTime, value: date}
  ]);

  let results = [];
  for (let i=0; i<resultSet?.recordset.length; i++) {
    let res: any = resultSet?.recordset[i];
    let itemResultSet = await getTagRequestItems(res.ref_id, branchId);
    results.push({...res, items: itemResultSet});
  }

  return results; 
}