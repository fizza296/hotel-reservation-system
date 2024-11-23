// /pages/api/auth/signout.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  // Obtain the cookie store and delete the session cookie
  const cookieStore = cookies();
  cookieStore.delete('session');

  // Correctly set the cookie to expire, ensuring the cookie is invalidated
  const response = NextResponse.next();
  response.headers.set('Set-Cookie', 'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict');

  // Use the static method to create a redirect response
  return NextResponse.redirect('http://localhost:3000');
}
