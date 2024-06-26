import { NextRequest, NextResponse } from "next/server";
import { signIn, signOut } from '@/auth'
import { getUserByUsername } from '@/repository/users';
import { apiResponse } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    signOut();
    return apiResponse({success: true}, 200);
  } 
  catch (error: any) {  
    return apiResponse({message: "Something went wrong."}, 500);
  }
}