import { NextResponse } from 'next/server';
import db from '../../../../db'; // Adjust path as needed
import { RowDataPacket } from 'mysql2';

export async function GET() {
  try {
    const [hotels] = await db.promise().query<RowDataPacket[]>(
      `SELECT hotel_id, name, description, image_link, rating, area, formatted_address FROM Hotels`
    );

    return NextResponse.json(hotels, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error: (error as Error).message }, { status: 500 });
  }
}
