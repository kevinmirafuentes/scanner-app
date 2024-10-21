import { apiResponse } from "@/lib/utils";
import { getSuppliers } from "@/repository/suppliers";

export async function GET(
  request: Request 
) {
  const results = await getSuppliers();
  return apiResponse(results, 200);
}