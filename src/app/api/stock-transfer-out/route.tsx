import { apiResponse } from "@/lib/utils";

export async function POST(
  request: Request
) {
  return apiResponse({test: 'succeses'}, 200);
}