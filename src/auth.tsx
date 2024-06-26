import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { decrypt, encrypt } from "./lib/utils";
import { AuthUser } from "./types/types";

export async function signIn(user: AuthUser) {
  const expires = new Date(Date.now() + 10 * 1000);
  const session = JSON.stringify(user);
  cookies().set('auth', encrypt(session), {expires, httpOnly: true});
}

export function signOut() {
  cookies().set('auth', '', {expires: new Date(0)});
}

export function getSession() {
  let session = cookies().get('auth')?.value;
  if (!session) return null;
  return JSON.parse(decrypt(session));
}

export function refreshSession(request: NextRequest) {
  let session = cookies().get('auth')?.value;
  if (!session) return null;

  const response = NextResponse.next();
  response.cookies.set({
    name: 'auth',
    value: session,
    httpOnly: true,
    expires: new Date(Date.now() + 10 * 1000)
  })
}

export function isAuthenticated() {
  let session = cookies().get('auth')?.value;
  if (session) {
    return true;
  };
  return false;
}