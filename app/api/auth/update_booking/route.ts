import db from "../../../../db";
import { NextResponse } from "next/server";
import { ResultSetHeader} from "mysql2";

export async function POST(req: Request) {
  try {
    const { bookingId, check_in, check_out, status } = await req.json();
    const { searchParams } = new URL(req.url);
    const bookid = searchParams.get('booking_id');

    
    const [result] = await db.promise().query<ResultSetHeader>(
      "UPDATE Bookings SET check_in_date = ?, check_out_date = ?, status = ? WHERE booking_id = ?",
      [check_in, check_out, status, bookid]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "No booking found to update." }, { status: 404 });
    }

    return NextResponse.json({ message: "Booking updated successfully." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Failed to update booking." }, { status: 500 });
  }
}





