import db from "../../../../db";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bookingId = searchParams.get("booking_id");

  if (!bookingId) {
    return NextResponse.json({ message: "Booking ID is required." }, { status: 400 });
  }

  try {
    const [rows] = await db.promise().query<RowDataPacket[]>(`
      SELECT booking_id, check_in_date, check_out_date, special_requests 
      FROM Bookings 
      WHERE booking_id = ?
    `, [bookingId]);

    if (rows.length === 0) {
      return NextResponse.json({ message: "Booking not found." }, { status: 404 });
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching booking details:", error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
