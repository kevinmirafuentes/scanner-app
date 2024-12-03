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

function getBarcodeType(barcode: string) {
  // Remove any non-digit or non-alphanumeric characters
  const cleanedBarcode = barcode.replace(/[^0-9A-Za-z]/g, '');
  
  // Check for EAN-13 (13 digits)
  if (/^\d{13}$/.test(cleanedBarcode)) {
    return 'EAN-13';
  }

  // Check for UPC-A (12 digits)
  if (/^\d{12}$/.test(cleanedBarcode)) {
    return 'UPC-A';
  }

  // Check for EAN-8 (8 digits)
  if (/^\d{8}$/.test(cleanedBarcode)) {
    return 'EAN-8';
  }

  // Check for Code 39 (alphanumeric, and typically includes characters like "-", "/")
  if (/^[0-9A-Za-z\-\/]+$/.test(cleanedBarcode)) {
    return 'Code 39';
  }

  // Check for Code 128 (more complex, alphanumeric, can include special characters)
  if (/^[0-9A-Za-z!#$%&'()*+,-./:;<=>?@[\\]^_`{|}~]+$/.test(cleanedBarcode)) {
    return 'Code 128';
  }

  // Check for QR Code: if it starts with 'http', 'BEGIN' or some known QR patterns
  // Note: This is just a simple heuristic and might need refinement.
  if (/^http|BEGIN|^([A-Za-z0-9]{2,4})\d{10,15}$/.test(cleanedBarcode)) {
    return 'QR Code';
  }

  // If none of the above, return 'Unknown'
  return 'Unknown';
}


export function formatBarcode(code: string): string  {
  code = code.trim();
  let type = getBarcodeType(code);

  if (type === 'EAN-8') {
    return `0000${code}`;
  }
  
  if (type === 'EAN-13') {
    return code.substr(0, 12);
  }

  return code;
}

export async function getBarcodeDetails(barcode: string, supplierId?: string|null) {
  let res = await fetch(`/api/products/${barcode}/data?supp_id=${supplierId||''}`);
  return res;
}

export function printInNewTab(url: string) {
  let win = window.open('', '_blank');
  if (win) {
    win.location = url;
  }
}
