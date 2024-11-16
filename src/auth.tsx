"use server"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { decrypt, encrypt } from "./lib/utils";
import { AuthUser, Branch } from "./types/types";
import { cache } from "react";

const expires = new Date(Date.now() + 2592000 * 1000);

const authindex = process.env.APP_PREFIX + 'auth';
const branchindex = process.env.APP_PREFIX + 'current_branch';

export async function signIn(user: AuthUser, branch: Branch) {
  const session = JSON.stringify(user);
  const branchJson =  JSON.stringify(branch);
  cookies().set(authindex, encrypt(session), {expires, httpOnly: true});
  cookies().set(branchindex, encrypt(branchJson), {expires, httpOnly: true});
}

export async function signOut() {
  cookies().set(authindex, '', {expires: new Date(0)});
}

export async function getSession() {
  let session = cookies().get(authindex)?.value;
  if (!session) return null;
  return JSON.parse(decrypt(session));
}

export async function getCurrentBranch() {
  let branch = cookies().get(branchindex)?.value;
  if (!branch) return null;
  return JSON.parse(decrypt(branch));
}

export async function refreshSession(request: NextRequest) {
  let session = cookies().get(authindex)?.value;
  let currentBranch = cookies().get(branchindex)?.value;
  
  if (!session) return null;

  const response = NextResponse.next();
  response.cookies.set({
    name: authindex,
    value: session,
    httpOnly: true,
    expires: expires
  })
  // @ts-ignore
  response.cookies.set({
    name: branchindex,
    value: currentBranch,
    httpOnly: true,
    expires: expires
  })
}

export async function isAuthenticated() {
  let session = cookies().get(authindex)?.value;
  if (session) {
    return true;
  };
  return false;
}