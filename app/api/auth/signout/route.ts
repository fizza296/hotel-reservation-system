// /pages/api/auth/signout.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  // Obtain the cookie store and delete the session cookie
  const cookieStore = cookies();
  cookieStore.delete('session');

  // Correctly set the cookie to expire
  const response = NextResponse.next();
  response.headers.set('Set-Cookie', 'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict');

  // Redirect to the homepage or login page
  return NextResponse.redirect('http://localhost:3000');
}
