import { NextResponse } from 'next/server';
import db from '../../../../db'; // Adjust path as needed
import { RowDataPacket } from 'mysql2';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hotelId = searchParams.get("hotel_id");

  if (!hotelId) {
    return NextResponse.json({ message: "Hotel ID is required" }, { status: 400 });
  }

  try {
    // Fetch hotel details
    const [hotelDetails] = await db.promise().query<RowDataPacket[]>(
      "SELECT name FROM Hotels WHERE hotel_id = ?",
      [hotelId]
    );

    if (hotelDetails.length === 0) {
      return NextResponse.json({ message: "Hotel not found" }, { status: 404 });
    }

    const hotelName = hotelDetails[0].name;

    // Fetch rooms
    const [rooms] = await db.promise().query<RowDataPacket[]>(
      "SELECT room_id, room_type, is_available, amenities FROM Rooms WHERE hotel_id = ?",
      [hotelId]
    );

    // Fetch reviews
    const [reviews] = await db.promise().query<RowDataPacket[]>(
      "SELECT review_text, created_at FROM Reviews WHERE hotel_id = ?",
      [hotelId]
    );

    return NextResponse.json({ hotelName, rooms, reviews }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}




