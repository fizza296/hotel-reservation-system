// pages/api/auth/add_hotel.ts

import { NextResponse } from 'next/server';
import db from '../../../../db';
import { ResultSetHeader } from 'mysql2';

export async function POST(req: Request) {
  try {
    const { name, description, image_link, rating } = await req.json();

    // Updated validation to include image_link as required
    if (!name || !description || !image_link) {
      return NextResponse.json(
        { message: 'Name, description, and image link are required.' },
        { status: 400 }
      );
    }

    // Optional: Simple URL validation (basic check)
    const urlPattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,})' + // domain name
        '(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-zA-Z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-zA-Z\\d_]*)?$',
      'i'
    );
    if (!urlPattern.test(image_link)) {
      return NextResponse.json(
        { message: 'Invalid image link URL.' },
        { status: 400 }
      );
    }

    // Insert the new hotel into the database
    const [result] = await db.promise().query<ResultSetHeader>(
      `INSERT INTO Hotels (name, description, image_link, rating) VALUES (?, ?, ?, ?)`,
      [name, description, image_link, rating || null]
    );

    // Construct the new hotel object to return
    const newHotel = {
      hotel_id: result.insertId,
      name,
      description,
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
