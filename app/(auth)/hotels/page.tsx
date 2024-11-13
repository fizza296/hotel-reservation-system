"use client";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
//import { parseCookies } from 'nookies'; // Import nookies to parse cookies

type Hotel = {
  hotel_id: number;
  name: string;
  description: string;
  image_link: string;
};

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  // const searchParams = useSearchParams();
  // const cookies = parseCookies();
  // const userId = cookies.session ? cookies.session.replace('SESSION_', '') : null;

  useEffect(() => {
    async function fetchHotels() {
      try {
        const res = await fetch('/api/auth/hotels');
        const data = await res.json();
        setHotels(data);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchHotels();
    //console.log("Parsed User ID:", userId);
  }, []);

  if (loading) {
    return <div>Loading hotels...</div>;
  }

  const handleBookNow = (hotelId: number) => {
    router.push(`/rooms?hotel_id=${hotelId}`);
  };
    

  return (
    <div className="hotel-container">
      {hotels.map((hotel) => (
        <div key={hotel.hotel_id} className="hotel-card">
          <img src={hotel.image_link} alt={hotel.name} className="hotel-image" />
          <div className="hotel-info">
            <h2>{hotel.name}</h2>
            <p>{hotel.description}</p>
            <button onClick={() => handleBookNow(hotel.hotel_id)} className="book-button">Book Now</button>
          </div>
        </div>
      ))}
      <style jsx>{`
        .hotel-container {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          justify-content: center;
          padding: 20px;
        }
        .hotel-card {
          width: 300px;
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .hotel-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }
        .hotel-info {
          padding: 15px;
          text-align: center;
        }
        .book-button {
          margin-top: 10px;
          padding: 10px 20px;
          background-color: #0070f3;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .book-button:hover {
          background-color: #005bb5;
        }
      `}</style>
    </div>
  );
}
