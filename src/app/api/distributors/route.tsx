import { apiResponse } from "@/lib/utils";
import { getDistributors } from "@/repository/distributors";

export async function GET(
  request: Request 
) {
  const results = await getDistributors();
  return apiResponse(results, 200);
}