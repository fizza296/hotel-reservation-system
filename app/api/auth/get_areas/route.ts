import { NextResponse } from 'next/server';
import db from '../../../../db'; // Adjust the path as necessary
import { RowDataPacket } from 'mysql2';

// Define a type for the database row
interface HotelRow {
  area: string;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ message: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const [areas] = await db.promise().query<RowDataPacket[]>(
      `
      SELECT DISTINCT area 
      FROM Hotels 
      WHERE area LIKE ? 
      ORDER BY area ASC 
      LIMIT 10
      `,
      [`%${query}%`]
    );

    // Type assertion ensures TypeScript knows the structure of the data
    const areaList = (areas as HotelRow[]).map((row: HotelRow) => row.area);

    return NextResponse.json(areaList, { status: 200 });
  } catch (error) {
    console.error('Error fetching areas:', error);
    return NextResponse.json({ message: 'Server error', error: (error as Error).message }, { status: 500 });
  }
}
