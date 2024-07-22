import { apiResponse } from "@/lib/utils";
import { getNextReferenceId } from "@/repository/tagRequest";

export async function POST() {
  let res = await getNextReferenceId();
  return apiResponse(res, 200);
}