import { NextResponse } from 'next/server';
import db from '../../../../db';  // Adjust path as needed
import { RowDataPacket } from 'mysql2';

export async function POST(request: Request) {
  const { name, email, phone, password } = await request.json();

  try {
    // Check if the email already exists
    const [existingUser] = await db.promise().query<RowDataPacket[]>(
      `SELECT * FROM Users WHERE email = ?`,
      [email]
    );

    if (existingUser.length > 0) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Insert the new user into the database
    await db.promise().query(
      `INSERT INTO Users (username, email, phone_number, password) VALUES (?, ?, ?, ?)`,
      [name, email, phone, password]
    );

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error occurred during signup:', error);  // Log the error for debugging
    return NextResponse.json({ message: 'Server error', error: (error as Error).message }, { status: 500 });
  }
}
