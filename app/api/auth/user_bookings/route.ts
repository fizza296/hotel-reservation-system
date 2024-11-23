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
    const [bookings] = await db.promise().query<RowDataPacket[]>(`
      SELECT 
        b.booking_id,
        h.name AS hotel_name, -- Corrected column name
        r.room_type,
        b.check_in_date,
        b.check_out_date,
        b.status,
        b.special_requests,
        b.created_at
      FROM Bookings b
      JOIN Hotels h ON b.hotel_id = h.hotel_id
      JOIN Rooms r ON b.room_id = r.room_id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `, [userId]);

    if (bookings.length === 0) {
      return NextResponse.json({ message: 'No previous bookings found' }, { status: 200 });
    }

    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ message: 'Error fetching bookings', error: (error as Error).message }, { status: 500 });
  }
}



