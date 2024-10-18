import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated, refreshSession } from "./auth";
import { redirect } from "next/navigation";

export async function middleware(request: NextRequest) {
  if (!await isAuthenticated()) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return await refreshSession(request);
}

export const config = {
  matcher: [
    '/',
    '/price-checker',
    '/inventory-checker',
    '/stock-request',
    '/tag-request',
    '/physical-count',
    '/purchase-returns',
    '/stock-adjustments-in',
    '/stock-adjustments-out',
    '/stock-transfer-in',
    '/stock-transfer-out'
  ],
}