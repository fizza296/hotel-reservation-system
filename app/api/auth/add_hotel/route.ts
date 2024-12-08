import { NextResponse } from 'next/server';
import db from '../../../../db';
import { ResultSetHeader } from 'mysql2';

export async function POST(req: Request) {
  try {
    const {
      name,
      description,
      phone_number,
      address,
      website,
      google_maps_url,
      image_link,
      rating,
    } = await req.json();

    // Validate required fields
    if (!name || !description || !phone_number || !address || !image_link) {
      return NextResponse.json(
        { message: 'Name, description, phone number, address, and image link are required.' },
        { status: 400 }
      );
    }

    // Insert into the database
    const [result] = await db.promise().query<ResultSetHeader>(
      `INSERT INTO Hotels (name, description, phone_number, formatted_address, website_url, google_maps_url, image_link, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, description, phone_number, address, website || null, google_maps_url || null, image_link, rating || null]
    );

    // Construct the response
    const newHotel = {
      hotel_id: result.insertId,
      name,
      description,
      phone_number,
      address,
      website,
      google_maps_url,
      image_link,
      rating,
    };

    return NextResponse.json(newHotel, { status: 201 });
  } catch (error) {
    console.error('Error adding hotel:', error);
    return NextResponse.json(
      { message: 'Error adding hotel.', error: (error as Error).message },
      { status: 500 }
    );
  }
}
