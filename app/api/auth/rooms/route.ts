import { NextResponse } from 'next/server';
import db from '../../../../db';  // Adjust path as needed
import { RowDataPacket } from 'mysql2';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hotelId = searchParams.get('hotel_id');

  if (!hotelId) {
    return NextResponse.json({ message: 'Hotel ID is required' }, { status: 400 });
  }

  try {
    const [rooms] = await db.promise().query<RowDataPacket[]>(`
      SELECT room_id, hotel_id, room_type, is_available, amenities 
      FROM Rooms 
      WHERE hotel_id = ?
    `, [hotelId]);

    return NextResponse.json(rooms, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error: (error as Error).message }, { status: 500 });
  }
}

