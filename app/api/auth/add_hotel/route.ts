import { NextResponse } from 'next/server';
import db from '../../../../db';
import { ResultSetHeader } from 'mysql2';

export async function POST(req: Request) {
  try {
    const { name, description, image_link, rating } = await req.json();

    if (!name || !description) {
      return NextResponse.json({ message: 'Name and description are required' }, { status: 400 });
    }

    const [result] = await db.promise().query<ResultSetHeader>(
      `INSERT INTO Hotels (name, description, image_link, rating) VALUES (?, ?, ?, ?)`,
      [name, description, image_link || '', rating || null]
    );

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
    return NextResponse.json({ message: 'Error adding hotel', error: (error as Error).message }, { status: 500 });
  }
}






