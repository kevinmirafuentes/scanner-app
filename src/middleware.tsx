import { NextRequest } from "next/server";
import { refreshSession } from "./auth";

export async function middleware(request: NextRequest) {
  return await refreshSession(request);
}