import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { decrypt, encrypt } from "./lib/utils";
import { AuthUser } from "./types/types";

export async function signIn(user: AuthUser, { branch_id, branch_name}: { branch_id: number, branch_name: string}) {
  const expires = new Date(Date.now() + 10 * 1000);
  const session = JSON.stringify(user);
  const branch =  JSON.stringify({ branch_id, branch_name });
  cookies().set('auth', encrypt(session), {expires, httpOnly: true});
  cookies().set('currentBranch', encrypt(branch), {expires, httpOnly: true});
}

export function signOut() {
  cookies().set('auth', '', {expires: new Date(0)});
}

export function getSession() {
  let session = cookies().get('auth')?.value;
  if (!session) return null;
  return JSON.parse(decrypt(session));
}

export function refreshSession() {
  let session = cookies().get('auth')?.value;
  let currentBranch = cookies().get('currentBranch')?.value;
  let expires = new Date(Date.now() + 10 * 1000);

  if (!session) return null;

  cookies().set('auth', session, {expires, httpOnly: true});
  cookies().set('currentBranch', currentBranch || '', {expires, httpOnly: true});

}

export function isAuthenticated() {
  let session = cookies().get('auth')?.value;
  if (session) {
    return true;
  };
  return false;
}