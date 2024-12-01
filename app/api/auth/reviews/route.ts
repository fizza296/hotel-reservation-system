import { NextResponse } from 'next/server';
import db from '../../../../db'; // Adjust the path as needed
import { RowDataPacket } from 'mysql2';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hotelId = searchParams.get('hotel_id');

  if (!hotelId) {
    return NextResponse.json({ message: 'Hotel ID is required' }, { status: 400 });
  }

  try {
    // Fetch reviews for the hotel
    const [reviews] = await db.promise().query<RowDataPacket[]>(`
      SELECT review_text, created_at 
      FROM Reviews 
      WHERE hotel_id = ?
    `, [hotelId]);

    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error: (error as Error).message }, { status: 500 });
  }
}
