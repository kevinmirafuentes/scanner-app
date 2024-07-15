import { getProductByBarcode } from "@/repository/barcodes";
import { getProductPrices } from "@/repository/prices";
import { apiResponse, formatBarcode } from "@/lib/utils";
import { getSession } from "@/auth";
import { getDefaultBranch } from "@/repository/branch";

export async function GET(
  request: Request,
  { params: { barcode } }: { params: { barcode: string} }
) {

  let auth = await getSession();
  let branch = await getDefaultBranch();
  let result = {};
  let status = 200;
  let branchId = branch?.branch_id;

  try {
    let product = await getProductByBarcode(formatBarcode(barcode));
    let prices = [];

    if (product?.product_id) {
      prices = await getProductPrices(product.product_id, branchId);

      if (auth?.user_group_id && auth?.user_group_id != 1) {
        prices.map((p: any) => {
          delete p.supp_name;
          delete p.supp_id;
          return p;
        });
      }
    }

    result = {
      name: product?.name,
      prices: prices,
    };
  } catch (err) {
    console.log(err);
    result = {
      'message': 'Something went wrong'
    };
    status = 500;
  }

  return apiResponse(result, status);
}