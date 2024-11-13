// pages/api/users/route.ts
import { NextResponse } from 'next/server';
import db from '../../../../db';  // Adjust path as needed
import { RowDataPacket } from 'mysql2';

export async function GET() {
  try {
    // Query the database to retrieve all users
    const [users] = await db.promise().query<RowDataPacket[]>(
      `SELECT name, email FROM users`
    );

    // If no users found, return an appropriate message
    if (users.length === 0) {
      return NextResponse.json({ message: 'No users found' }, { status: 404 });
    }

    // Return the list of users
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error: (error as Error).message }, { status: 500 });
  }
}
