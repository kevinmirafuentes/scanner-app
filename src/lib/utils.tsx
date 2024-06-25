import Cryptr from "cryptr";

export function encrypt(val: string) {
  const cryptr = new Cryptr(process.env.AUTH_SECRET);
  return cryptr.encrypt(val);
}

export function decrypt(encryptedString: string) {
  const cryptr = new Cryptr(process.env.AUTH_SECRET);
  return cryptr.decrypt(encryptedString);
}