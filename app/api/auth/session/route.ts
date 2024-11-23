import { NextResponse } from 'next/server';
import db from '../../../../db';
import { RowDataPacket } from 'mysql2';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  // Extract user_id from the session cookie
  const userId = sessionCookie?.startsWith('SESSION_') 
    ? parseInt(sessionCookie.replace('SESSION_', ''), 10) 
    : null;

  if (!userId) {
    return NextResponse.json({ message: 'Please log in to view your bookings' }, { status: 401 });
  }

  try {
    // Fetch user data including name from the database
    const [userData] = await db.promise().query<RowDataPacket[]>(
      `SELECT username FROM Users WHERE user_id = ?`, [userId]
    );

    if (userData.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Assuming the 'name' column exists and contains the user's name
    const userName = userData[0].username;
    
    return NextResponse.json({ isLoggedIn: true, userId, name: userName }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ message: 'Error fetching user data', error: (error as Error).message }, { status: 500 });
  }
}
