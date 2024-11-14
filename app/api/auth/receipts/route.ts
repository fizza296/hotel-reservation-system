import { NextResponse } from 'next/server';
import db from '../../../../db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const cookieStore = cookies();  // Get the cookies from headers
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

    // Fetch the newly created receipt to send back to the client
    const [rows] = await db.promise().query<RowDataPacket[]>(
      `SELECT receipt_id, booking_id, user_id, receipt_date 
       FROM Receipts 
       WHERE receipt_id = ?`,
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
