import { NextResponse } from 'next/server';
import db from '../../../../db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  // Extract user_id from the session cookie if it exists
  const userId = sessionCookie?.startsWith('SESSION_') ? sessionCookie.replace('SESSION_', '') : null;

  // Log for debugging
  console.log("Parsed User ID from Cookie:", userId);

  if (!userId) {
    return NextResponse.json({ message: 'Please log in to create a receipt', status: 401 }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { booking_id } = body;

    if (!booking_id) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Insert a new receipt into the Receipts table
    const [result] = await db.promise().query<ResultSetHeader>(
      `INSERT INTO Receipts (booking_id, user_id) VALUES (?, ?)`,
      [booking_id, userId]  // Use the userId from the session cookie
    );

    const receiptId = result.insertId;

    // Fetch the receipt details along with user, hotel, room, and booking info
    const [rows] = await db.promise().query<RowDataPacket[]>(
      `
      SELECT 
        r.receipt_id, 
        r.booking_id, 
        r.user_id, 
        r.receipt_date,
        u.username,
        h.name AS hotel_name,
        ro.room_type,
        b.check_in_date,
        b.check_out_date,
        b.special_requests
      FROM Receipts r
      JOIN Users u ON r.user_id = u.user_id
      JOIN Bookings b ON r.booking_id = b.booking_id
      JOIN Rooms ro ON b.room_id = ro.room_id
      JOIN Hotels h ON ro.hotel_id = h.hotel_id
      WHERE r.receipt_id = ?
      `,
      [receiptId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: 'Receipt not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error('Error in receipts route:', error);
    return NextResponse.json({ message: 'Error creating receipt', error: (error as Error).message }, { status: 500 });
  }
}
