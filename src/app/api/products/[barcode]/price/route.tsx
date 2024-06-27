import { getProductByBarcode } from "@/repository/barcodes";
import { getProductPrices } from "@/repository/prices";
import { apiResponse, formatBarcode } from "@/lib/utils";
import { getSession } from "@/auth";

// todo:
//  - when admin user; then do not include supplier details
//  - when admin user; include inventory per price/uom

export async function GET(
  request: Request,
  { params: { barcode } }: { params: { barcode: string} }
) {

  let auth = getSession();
  let result = {};
  let status = 200;
  let branchId = auth ? auth.branch_id : null;

  try {
    let product = await getProductByBarcode(formatBarcode(barcode));
    let prices = [];

    if (product?.product_id) {
      prices = await getProductPrices(product?.product_id, branchId);

      // if (auth?.user_group_id != 1) {
      //   prices.map(p => {
      //     delete p.supp_name;
      //     delete p.supp_id;
      //     return p;
      //   });
      // }
    }

    result = {
      name: product?.name,
      prices: prices,
    };
  } catch (err) {
    result = {
      'message': 'Something went wrong'
    };
    status = 500;
  }

  return apiResponse(result, status);
}