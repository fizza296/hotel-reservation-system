// pages/api/auth/rooms.ts

import { NextResponse } from "next/server";
import db from "../../../../db"; // Adjust path as needed
import { RowDataPacket, OkPacket } from "mysql2";
import { cookies } from "next/headers";

type ReviewResponse = {
  review_text: string;
  created_at: string;
  rating: number;
  reviewer_name: string;
  // Optionally, add reviewer_avatar: string;
};

// GET handler to fetch hotel details, rooms, and reviews
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

// POST handler to add a new review
export async function POST(request: Request) {
  try {
    // Extract cookies from the request
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    // Extract user_id from the session cookie
    const userId = sessionCookie?.startsWith("SESSION_")
      ? parseInt(sessionCookie.replace("SESSION_", ""), 10)
      : null;

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in to submit a review." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { hotel_id, review_text, rating } = body;

    // Validate required fields
    if (!hotel_id || !review_text || !rating) {
      return NextResponse.json(
        { message: "Hotel ID, review text, and rating are required." },
        { status: 400 }
      );
    }

    // Optional: Validate that the hotel exists
    const [hotelExists] = await db.promise().query<RowDataPacket[]>(
      "SELECT hotel_id FROM Hotels WHERE hotel_id = ?",
      [hotel_id]
    );

    if (hotelExists.length === 0) {
      return NextResponse.json(
        { message: "Hotel not found." },
        { status: 400 }
      );
    }

    // Insert review into the database
    const insertResult = await db.promise().query<OkPacket>(
      `
      INSERT INTO Reviews (hotel_id, review_text, rating, user_id, created_at)
      VALUES (?, ?, ?, ?, NOW())
      `,
      [hotel_id, review_text, rating, userId]
    );

    // Fetch the newly inserted review to return
    const [newReviewRows] = await db.promise().query<RowDataPacket[]>(
      `
      SELECT 
        Reviews.review_text, 
        Reviews.created_at, 
        Reviews.rating, 
        Users.username AS reviewer_name 
      FROM Reviews 
      JOIN Users ON Reviews.user_id = Users.user_id 
      WHERE Reviews.review_id = ?
      `,
      [insertResult[0].insertId]
    );

    if (newReviewRows.length === 0) {
      return NextResponse.json(
        { message: "Review added but could not retrieve the review." },
        { status: 201 }
      );
    }

    // Map the RowDataPacket to ReviewResponse
    const newReview: ReviewResponse = {
      review_text: newReviewRows[0].review_text,
      created_at: newReviewRows[0].created_at,
      rating: newReviewRows[0].rating,
      reviewer_name: newReviewRows[0].reviewer_name,
    };

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error("Error adding review:", error);
    return NextResponse.json(
      { message: "Server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
