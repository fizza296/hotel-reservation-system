"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Hotel = {
  hotel_id: number;
  name: string;
  description: string;
  image_link: string;
  rating: number; // Add rating property
};

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchHotels() {
      try {
        const res = await fetch("/api/auth/hotels");
        const data = await res.json();
        setHotels(data);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchHotels();
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
            <div className="hotel-rating">
              {[...Array(5)].map((_, index) => {
                const isFull = index < Math.floor(hotel.rating);
                const isPartial = index === Math.floor(hotel.rating) && hotel.rating % 1 !== 0;

                return (
                  <div
                    key={index}
                    className={`star ${isFull ? "filled" : ""} ${isPartial ? "partial" : ""}`}
                    style={{
                      backgroundImage: isPartial
                        ? `linear-gradient(90deg, #ffcc00 ${((hotel.rating % 1) * 100).toFixed(
                            2
                          )}%, #ddd ${((hotel.rating % 1) * 100).toFixed(2)}%)`
                        : undefined,
                    }}
                  >
                    ★
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => handleBookNow(hotel.hotel_id)}
              className="book-button"
            >
              Book Now
            </button>
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
          background: #fff;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hotel-card:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }
        .hotel-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-bottom: 2px solid #ddd;
        }
        .hotel-info {
          padding: 15px;
          text-align: center;
        }
        .hotel-rating {
          display: flex;
          justify-content: center;
          margin: 10px 0;
        }
        .star {
          font-size: 18px;
          color: #ddd;
          width: 18px;
          height: 18px;
          display: inline-block;
          line-height: 18px;
          text-align: center;
          background-color: #ddd;
          background-clip: text;
          -webkit-background-clip: text;
        }
        .star.filled {
          color: #ffcc00;
          background-color: #ffcc00;
        }
        .star.partial {
          color: transparent;
          background-clip: content-box;
          -webkit-background-clip: text;
        }
        .book-button {
          margin-top: 10px;
          padding: 10px 20px;
          background-color: #0070f3;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }
        .book-button:hover {
          background-color: #005bb5;
        }
      `}</style>
    </div>
  );
}
