import { getCurrentBranch } from "@/auth";
import { apiResponse } from "@/lib/utils";
import { getTagRequestById } from "@/repository/tagRequest";

export async function GET(
  request: Request,
  { params: { id } }: { params: { id: string} }
) {
  let { branch_id } = await getCurrentBranch();
  let res = await getTagRequestById(id, branch_id);
  return apiResponse(res, 200);
}