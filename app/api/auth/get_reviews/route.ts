// pages/api/auth/get_reviews.ts

import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../../db'; // Adjust the path as needed
import { RowDataPacket } from 'mysql2';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { hotel_id } = req.query;

    if (!hotel_id) {
      return res.status(400).json({ message: 'Hotel ID is required' });
    }

    try {
      // Fetch reviews for the hotel
      const [reviews] = await db.promise().query<RowDataPacket[]>(`
        SELECT review_id, hotel_id, user_id, rating, review_text, created_at 
        FROM Reviews 
        WHERE hotel_id = ?
        ORDER BY created_at DESC
      `, [hotel_id]);

      return res.status(200).json(reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
