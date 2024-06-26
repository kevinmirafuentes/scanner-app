import { NextRequest, NextResponse } from "next/server";
import { signIn } from '@/auth'
import { getUserByUsername } from '@/repository/users';
import { apiResponse } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const user = await getUserByUsername(username);

    if (!user || !user.mobile_login_pwd || user.mobile_login_pwd != password) {
      throw new Error('Invalid username or password');
    }

    await signIn(username);
    return apiResponse({success: true}, 200);

  } catch (error: any) {
    if (error.message) {
      return apiResponse({message: error.message}, 401);
    }
    return apiResponse({message: "Something went wrong."}, 500);
  }
}