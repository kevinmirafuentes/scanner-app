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

export function formatBarcode(code: string): string  {
  if (code.length == 13) {
    return code.substr(0, 12);
  }
  return code;
}