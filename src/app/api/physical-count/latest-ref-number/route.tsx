import { getCurrentBranch } from "@/auth";
import { apiResponse } from "@/lib/utils";
import { getLatestRefNumber } from "@/repository/physicalCount";

export async function GET(
  request: Request
) {
  const { branch_id } = await getCurrentBranch();
  const latestRefNum = await getLatestRefNumber(branch_id);
  return apiResponse({latestRefNum}, 200);
}