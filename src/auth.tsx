"use server"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { decrypt, encrypt } from "./lib/utils";
import { AuthUser, Branch } from "./types/types";

export async function signIn(user: AuthUser, branch: Branch) {
  const expires = new Date(Date.now() + 10 * 1000);
  const session = JSON.stringify(user);
  const branchJson =  JSON.stringify(branch);
  cookies().set('auth', encrypt(session), {expires, httpOnly: true});
  cookies().set('current_branch', encrypt(branchJson), {expires, httpOnly: true});
}

export async function signOut() {
  cookies().set('auth', '', {expires: new Date(0)});
}

export async function getSession() {
  let session = cookies().get('auth')?.value;
  if (!session) return null;
  return JSON.parse(decrypt(session));
}

export async function getCurrentBranch() {
  let branch = cookies().get('current_branch')?.value;
  if (!branch) return null;
  return JSON.parse(decrypt(branch));
}

export async function refreshSession(request: NextRequest) {
  let session = cookies().get('auth')?.value;
  let currentBranch = cookies().get('current_branch')?.value;
  let expires = new Date(Date.now() + 10 * 1000);
  
  if (!session) return null;

  const response = NextResponse.next();
  response.cookies.set({
    name: 'auth',
    value: session,
    httpOnly: true,
    expires: expires
  })

  
  // cookies().set('current_branch', currentBranch, {expires, httpOnly: true});
}

export async function isAuthenticated() {
  let session = cookies().get('auth')?.value;
  if (session) {
    return true;
  };
  return false;
}