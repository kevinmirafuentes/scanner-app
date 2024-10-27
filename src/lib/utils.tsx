import Cryptr from "cryptr";
import { NextResponse } from "next/server";

export function encrypt(val: string) {
  // @ts-ignore
  const cryptr = new Cryptr(process.env.AUTH_SECRET);
  return cryptr.encrypt(val);
}

export function decrypt(encryptedString: string) {
  // @ts-ignore
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

export async function getBarcodeDetails(barcode: string) {
  let res = await fetch(`/api/products/${barcode}/data`);
  return res;
}

export function printInNewTab(url: string) {
  let win = window.open('', '_blank');
  if (win) {
    win.location = url;
  }
}
