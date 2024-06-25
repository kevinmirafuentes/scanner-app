import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from "next/server";
import { signIn } from '@/auth'
import { getUserByUsername } from '@/repository/users';

export async function POST(
  req: NextRequest,
  res: NextApiResponse
) {
  try {
    const { username, password } = await req.json();

    const user = await getUserByUsername(username);

    if (!user || !user.mobile_login_pwd || user.mobile_login_pwd != password) {
      throw new Error('Invalid username or password');
    }

    await signIn(username);

    return NextResponse.json({
      success: true
    }, { status: 200 });

  } catch (error: any) {
    if (error.message) {
      return NextResponse.json({
        message: error.message,
      }, { status: 401 });
    } 
    return NextResponse.json({
      message: "Something went wrong.",
    }, { status: 500 });
  }
}