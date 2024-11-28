import { NextResponse } from 'next/server';
import db from '../../../../db'; // Adjust path as needed
import { RowDataPacket } from 'mysql2';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hotelId = searchParams.get('hotel_id');

  if (!hotelId) {
    return NextResponse.json({ message: 'Hotel ID is required' }, { status: 400 });
  }

  try {
    // Fetch room details for the given hotel
    const [rooms] = await db.promise().query<RowDataPacket[]>(`
      SELECT room_id, room_type, is_available, amenities 
      FROM Rooms 
      WHERE hotel_id = ?
    `, [hotelId]);

    // Ensure 'rooms' is an array
    if (!Array.isArray(rooms)) {
      throw new Error('Failed to fetch rooms or invalid format.');
    }

    // Fetch reviews for the given hotel
    const [reviews] = await db.promise().query<RowDataPacket[]>(`
      SELECT review_text, created_at 
      FROM Reviews 
      WHERE hotel_id = ?
    `, [hotelId]);

    // Ensure 'reviews' is an array
    if (!Array.isArray(reviews)) {
      throw new Error('Failed to fetch reviews or invalid format.');
    }

    // Return rooms and reviews separately
    return NextResponse.json({ rooms, reviews }, { status: 200 });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ message: 'Server error', error: (error as Error).message }, { status: 500 });
  }
}



