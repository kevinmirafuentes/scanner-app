import Cryptr from "cryptr";
import { NextResponse } from "next/server";

export function encrypt(val: string) {
  const cryptr = new Cryptr(process.env.AUTH_SECRET);
  return cryptr.encrypt(val);
}

export function decrypt(encryptedString: string) {
  const cryptr = new Cryptr(process.env.AUTH_SECRET);
  return cryptr.decrypt(encryptedString);
}

export function apiResponse(data: any, status?: number|null) {
  return NextResponse.json(data, { status: status || 200 });
}