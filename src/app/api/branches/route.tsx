import { apiResponse } from "@/lib/utils";
import { getBranches } from "@/repository/branch";

export async function GET(
  request: Request 
) {
  const results = await getBranches();
  return apiResponse(results, 200);
}