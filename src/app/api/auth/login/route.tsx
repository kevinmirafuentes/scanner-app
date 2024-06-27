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

    // todo: 
    // get branch where user is connected to via query and save to session for use in queries: 
    //   select var_value from imasterprofiles..settings where var_name = 'DEFAULT_BRANCH'

    await signIn(user);
    return apiResponse({success: true}, 200);

  } catch (error: any) {
    if (error.message) {
      return apiResponse({message: error.message}, 401);
    }
    return apiResponse({message: "Something went wrong."}, 500);
  }
}