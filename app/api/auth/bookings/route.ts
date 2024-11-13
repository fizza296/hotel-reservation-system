import { NextResponse } from 'next/server';
import db from '../../../../db';
import { ResultSetHeader } from 'mysql2';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const cookieStore = cookies();  // Get the cookies from headers
  const sessionCookie = cookieStore.get('session')?.value;
  
  // Extract user_id from the session cookie if it exists
  const userId = sessionCookie?.startsWith('SESSION_') ? sessionCookie.replace('SESSION_', '') : null;

  // Log for debugging
  console.log("Parsed User ID from Cookie:", userId);
  console.log("All Cookies:", cookieStore);

  if (!userId) {
    return NextResponse.json({ message: 'Please log in to book a room', status: 401 }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { hotel_id, room_id, check_in_date, check_out_date, special_requests } = body;

    if (!hotel_id || !room_id || !check_in_date || !check_out_date) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const [result] = await db.promise().query<ResultSetHeader>(
      `INSERT INTO Bookings (user_id, hotel_id, room_id, check_in_date, check_out_date, special_requests)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, hotel_id, room_id, check_in_date, check_out_date, special_requests]
    );

    return NextResponse.json({ message: 'Booking created successfully', booking_id: result.insertId }, { status: 201 });
  } catch (error) {
    console.error('Error in bookings route:', error);
    return NextResponse.json({ message: 'Error creating booking', error: (error as Error).message }, { status: 500 });
  }
}




  