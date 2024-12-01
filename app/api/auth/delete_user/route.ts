import { NextResponse } from 'next/server';
import db from '../../../../db';

export async function DELETE(req: Request) {
  try {
    const { user_id } = await req.json();

    if (!user_id) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    const [result] = await db.promise().query(
      `DELETE FROM Users WHERE user_id = ?`,
      [user_id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ message: 'Error deleting user', error: (error as Error).message }, { status: 500 });
  }
}
