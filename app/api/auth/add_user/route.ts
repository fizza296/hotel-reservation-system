import { NextResponse } from 'next/server';
import { ResultSetHeader } from 'mysql2';
import db from '../../../../db'; // Assuming you have a db connection helper

export async function POST(req: Request) {
  try {
    const { username, email, phone_number, password } = await req.json();

    // Insert new user without password hashing
    const [result] = await db.promise().query<ResultSetHeader>(
      `INSERT INTO Users (username, email, phone_number, password) VALUES (?, ?, ?, ?)`,
      [username, email, phone_number || null, password] // Ensure phone_number can be null
    );

    // Retrieve the inserted user (optional, if you want to return it)
    const newUser = {
      user_id: result.insertId,
      username,
      email,
      phone_number,
    };

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error adding user:', error);
    return NextResponse.json(
      { message: 'Failed to add user' },
      { status: 500 }
    );
  }
}


