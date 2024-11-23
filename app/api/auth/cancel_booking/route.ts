import { NextResponse } from "next/server";
import db from "../../../../db";
import { cookies } from "next/headers";
import { OkPacket } from "mysql2";

export async function POST(request: Request) {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  // Extract user_id from session cookie
  const userId = sessionCookie?.startsWith("SESSION_") ? sessionCookie.replace("SESSION_", "") : null;

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized", status: 401 }, { status: 401 });
  }

  try {
    const { booking_id } = await request.json();

    if (!booking_id) {
      return NextResponse.json({ message: "Missing booking_id" }, { status: 400 });
    }

    // Update the status of the booking from 'confirmed' to 'cancelled'
    const [result] = await db
      .promise()
      .query<OkPacket>("UPDATE Bookings SET status = 'cancelled' WHERE booking_id = ? AND user_id = ?", [booking_id, userId]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Booking not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Booking cancelled successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error canceling booking:", error);
    return NextResponse.json({ message: "Error canceling booking" }, { status: 500 });
  }
}




  