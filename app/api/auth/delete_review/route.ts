// app/api/auth/delete_review/route.ts

import { NextResponse } from 'next/server';
import db from '../../../../db'; // Adjust the path as needed
import { ResultSetHeader } from 'mysql2';

// DELETE /api/auth/delete_review?review_id=123
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const reviewIdStr = searchParams.get('review_id');

  // Validate the presence of 'review_id'
  if (!reviewIdStr) {
    return NextResponse.json(
      { message: 'Review ID is required' },
      { status: 400 }
    );
  }

  // Validate that 'review_id' is a number
  const review_id = parseInt(reviewIdStr, 10);
  if (isNaN(review_id)) {
    return NextResponse.json(
      { message: 'Invalid Review ID' },
      { status: 400 }
    );
  }

  try {
    // Execute the DELETE query
    const [result] = await db.promise().query<ResultSetHeader>(
      `DELETE FROM Reviews WHERE review_id = ?`,
      [review_id]
    );

    // Check if any row was affected (i.e., deleted)
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: 'Review not found' },
        { status: 404 }
      );
    }

    // Successful deletion
    return NextResponse.json(
      { message: 'Review deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { message: 'Error deleting review', error: (error as Error).message },
      { status: 500 }
    );
  }
}



