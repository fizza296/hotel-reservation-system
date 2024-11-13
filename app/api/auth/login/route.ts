import { NextResponse } from 'next/server';
import db from '../../../../db';  // Adjust path as needed
import { RowDataPacket } from 'mysql2';
import { serialize } from 'cookie';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    const [user] = await db.promise().query<RowDataPacket[]>(
      'SELECT * FROM Users WHERE email = ? AND password = ?',
      [email, password]
    );

    if (user.length === 0) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const userData = user[0];
    const sessionToken = `SESSION_${userData.user_id}`;  // Adjusted token format

    // Set session token in a cookie
    const cookie = serialize('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',  // Secure in production
      maxAge: 60 * 60 * 24 * 7,  // 1 week expiration
      path: '/',
      sameSite: 'lax',  // Adjust as needed
    });

    // Log cookie being set (for debugging)
    console.log('Setting Cookie:', cookie);

    const response = NextResponse.json({
      message: 'Authentication successful',
      user: userData,
    });

    // Set the cookie in the response headers
    response.headers.append('Set-Cookie', cookie);
    return response;

  } catch (error) {
    return NextResponse.json({ message: 'Server error', error: (error as Error).message }, { status: 500 });
  }
}




