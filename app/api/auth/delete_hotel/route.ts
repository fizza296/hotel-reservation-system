import { NextResponse } from 'next/server';
import db from '../../../../db';
import { ResultSetHeader } from 'mysql2';

export async function DELETE(req: Request) {
  try {
    const { hotel_id } = await req.json();

    if (!hotel_id) {
      return NextResponse.json({ message: 'Hotel ID is required' }, { status: 400 });
    }

    const [result] = await db.promise().query<ResultSetHeader>(
      `DELETE FROM Hotels WHERE hotel_id = ?`,
      [hotel_id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'Hotel not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Hotel deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting hotel:', error);
    return NextResponse.json({ message: 'Error deleting hotel', error: (error as Error).message }, { status: 500 });
  }
}
