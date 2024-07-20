import { getCurrentBranch, getSession } from "@/auth";
import { apiResponse } from "@/lib/utils";
import { getTagRequestsByDate, saveTagRequest } from "@/repository/tagRequest";

export async function POST(
  request: Request
) {
  let auth = await getSession();
  let tagRequest = await request.json();
  tagRequest.user = {user_id: auth?.user_id};
  let res = await saveTagRequest(tagRequest);
  return apiResponse(res, 200);
}

export async function GET(
  request: Request
) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const { branch_id } = await getCurrentBranch();
  const results = await getTagRequestsByDate(new Date(searchParams.get('date') || ''), branch_id);
  return apiResponse(results, 200);
}