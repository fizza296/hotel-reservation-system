// pages/api/auth/rooms.ts

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
      "SELECT name, formatted_address, description, rating, phone_number, website_url, google_maps_url, image_link FROM Hotels WHERE hotel_id = ?",
      [hotelId]
    );

    if (hotelDetails.length === 0) {
      return NextResponse.json({ message: "Hotel not found" }, { status: 404 });
    }

    const hotel = hotelDetails[0];

    // Fetch rooms
    const [rooms] = await db.promise().query<RowDataPacket[]>(
      "SELECT room_id, room_type, is_available, amenities FROM Rooms WHERE hotel_id = ?",
      [hotelId]
    );

    // Fetch reviews with reviewer names and ratings
    const [reviews] = await db.promise().query<RowDataPacket[]>(
      `
      SELECT 
        Reviews.review_text, 
        Reviews.created_at, 
        Reviews.rating, 
        Users.username AS reviewer_name 
      FROM Reviews 
      JOIN Users ON Reviews.user_id = Users.user_id 
      WHERE Reviews.hotel_id = ?
      ORDER BY Reviews.created_at DESC
      `,
      [hotelId]
    );

    return NextResponse.json({ hotel, rooms, reviews }, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { message: "Server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
