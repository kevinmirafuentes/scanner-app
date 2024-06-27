import { query } from "./db";
import sql from 'mssql';

export async function getUserByUsername(username: string) {
  let userSql = `
    select top 1
    u.user_id,
    u.full_name,
    u.mobile_login_pwd,
    u.user_group_id
    from imasterprofiles.dbo.MyUsers u
    where u.user_name = @uname
  `;
  let result = await query(userSql, [{name: 'uname', type: sql.VarChar, value: username}]);
  return result?.recordset[0];
}

export async function getProductByBarcode(code: string) {
  let clean = parseInt(code);

  // get product detail
  let prodSql = `
    select top 1
      p.product_id,
      p.long_descript as name
    from imasterprofiles.dbo.Product p
    inner join imasterprofiles.dbo.BarcodeH h on (h.product_id = p.product_id)
    where h.barcode = '${clean}'
  `
  let result = await query(prodSql);
  return result?.recordset[0];
};