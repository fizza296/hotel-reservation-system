import { NextResponse } from 'next/server';
import db from '../../../../db';

export async function DELETE(req: Request) {
  try {
    const { review_id } = await req.json();

    if (!review_id) {
      return NextResponse.json({ message: 'Review ID is required' }, { status: 400 });
    }

    const [result] = await db.promise().query(
      `DELETE FROM Reviews WHERE review_id = ?`,
      [review_id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Review deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ message: 'Error deleting review', error: (error as Error).message }, { status: 500 });
  }
}
