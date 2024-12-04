"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Hotel = {
  hotel_id: number;
  name: string;
  description: string;
  image_link: string;
  rating: number;
};

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState(0);
  const router = useRouter();

  useEffect(() => {
    async function fetchHotels() {
      try {
        const res = await fetch("/api/auth/get_hotels");
        const data = await res.json();

        if (Array.isArray(data)) {
          setHotels(data);
        } else {
          console.error("Unexpected data format:", data);
          setHotels([]);
        }
      } catch (error) {
        console.error("Error fetching hotels:", error);
        setHotels([]);
      } finally {
        setLoading(false);
      }
    }

    fetchHotels();
  }, []);

  if (loading) {
    return <div>Loading hotels...</div>;
  }

  if (hotels.length === 0) {
    return <div>No hotels available.</div>;
  }

  const handleBookNow = (hotelId: number) => {
    router.push(`/rooms?hotel_id=${hotelId}`);
  };

  const filteredHotels = hotels.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterRating === 0 || Math.floor(hotel.rating) === filterRating)
  );

  return (
    <div className="hotel-container">
      <div className="filter-section">
        <input
          type="text"
          placeholder="Search hotels"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input styled-input"
        />
        <select
          value={filterRating}
          onChange={(e) => setFilterRating(Number(e.target.value))}
          className="rating-filter styled-input"
        >
          <option value={0}>All Ratings</option>
          {[1, 2, 3, 4, 5].map((rating) => (
            <option key={rating} value={rating}>
              {rating} Stars
            </option>
          ))}
        </select>
      </div>
      <div className="hotel-grid">
        {filteredHotels.map((hotel) => (
          <div key={hotel.hotel_id} className="hotel-card">
            <img src={hotel.image_link} alt={hotel.name} className="hotel-image" />
            <div className="hotel-info">
              <h2 className="hotel-name">{hotel.name}</h2>
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
                          ? `linear-gradient(90deg, #ffcc00 ${(
                              (hotel.rating % 1) * 100
                            ).toFixed(2)}%, #ddd ${(
                              (hotel.rating % 1) * 100
                            ).toFixed(2)}%)`
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
      </div>
      <style jsx>{`
        .hotel-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 20px;
        }

        .filter-section {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
          justify-content: center;
          align-items: center;
        }

        .styled-input {
          padding: 10px;
          border: 2px solid #ccc;
          border-radius: 25px;
          outline: none;
          font-size: 1rem;
          transition: border-color 0.3s;
        }

        .rating-filter {
          width: 150px;
        }

        .styled-input:focus {
          border-color: #0070f3;
        }

        .hotel-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          justify-items: center;
        }

        @media (min-width: 1024px) {
          .hotel-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .hotel-card {
          width: 300px;
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
          background: #fff;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          transform: rotate(0deg); /* Remove tilt */
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

        .hotel-name {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 10px;
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