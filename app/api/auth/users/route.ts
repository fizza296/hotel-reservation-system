import { NextResponse } from 'next/server';
import db from '../../../../db';
import { RowDataPacket } from 'mysql2';

export async function GET() {
  try {
    const [users] = await db.promise().query<RowDataPacket[]>(
      `SELECT user_id, username, email FROM Users`
    );

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ message: 'Error fetching users', error: (error as Error).message }, { status: 500 });
  }
}
