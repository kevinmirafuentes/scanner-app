import { getCurrentBranch } from "@/auth";
import { apiResponse } from "@/lib/utils";
import { getLatestRefNumber } from "@/repository/physicalCount";

export async function GET(
  request: Request
) {
  const { branch_code } = await getCurrentBranch();
  const latestRefNum = await getLatestRefNumber(branch_code.trim());
  return apiResponse({latestRefNum}, 200);
}