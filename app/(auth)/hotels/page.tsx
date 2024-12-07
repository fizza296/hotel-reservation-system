"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Hotel = {
  hotel_id: number;
  name: string;
  description: string;
  image_link: string;
  rating: number;
  area: string;
};

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState(0);
  const [filterArea, setFilterArea] = useState(""); // New state for area filter
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
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <style jsx>{`
          .loader-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 80vh;
            background-color: #f5f5f5;
          }

          .spinner {
            border: 8px solid #f3f3f3;
            border-top: 8px solid #0070f3;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            animation: spin 1.5s linear infinite;
          }

          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  if (hotels.length === 0) {
    return (
      <div className="no-hotels">
        <p>No hotels available.</p>
        <style jsx>{`
          .no-hotels {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 80vh;
            font-size: 1.2rem;
            color: #555;
            background-color: #f9f9f9;
          }
        `}</style>
      </div>
    );
  }

  const handleBookNow = (hotelId: number) => {
    router.push(`/rooms?hotel_id=${hotelId}`);
  };

  // Get unique areas for the area filter dropdown
  const uniqueAreas = Array.from(new Set(hotels.map((hotel) => hotel.area))).sort();

  // Filter hotels based on the search query, rating, and area
  const filteredHotels = hotels.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterRating === 0 || Math.floor(hotel.rating) === filterRating) &&
      (filterArea === "" || hotel.area === filterArea)
  );

  return (
    <div className="hotel-container">
      <h1 className="page-title">Explore Our Hotels</h1>
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
        <select
          value={filterArea}
          onChange={(e) => setFilterArea(e.target.value)}
          className="area-filter styled-input"
        >
          <option value="">All Areas</option>
          {uniqueAreas.map((area) => (
            <option key={area} value={area}>
              {area}
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
              <p className="hotel-description">{hotel.description}</p>
              <p className="hotel-area">
                <span className="location-icon">📍</span>
                {hotel.area}
              </p>
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
                          ? `linear-gradient(90deg, #ffcc00 ${(hotel.rating % 1) * 100}%, #ddd ${(hotel.rating % 1) * 100}%)`
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
          gap: 30px;
          padding: 30px 20px;
          background-color: #fafafa;
          min-height: 100vh;
        }

        .page-title {
          text-align: center;
          font-size: 2.5rem;
          color: #333;
          margin-bottom: 10px;
        }

        .filter-section {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          justify-content: center;
          align-items: center;
          margin-bottom: 30px;
        }

        .styled-input {
          padding: 12px 20px;
          border: 2px solid #ccc;
          border-radius: 30px;
          outline: none;
          font-size: 1rem;
          transition: border-color 0.3s, box-shadow 0.3s;
          width: 250px;
          max-width: 100%;
        }

        .rating-filter,
        .area-filter {
          width: 180px;
        }

        .styled-input:focus {
          border-color: #0070f3;
          box-shadow: 0 0 5px rgba(0, 112, 243, 0.5);
        }

        .hotel-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 25px;
          justify-items: center;
        }

        .hotel-card {
          width: 100%;
          max-width: 350px;
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .hotel-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 20px rgba(0, 0, 0, 0.2);
        }

        .hotel-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .hotel-info {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .hotel-name {
          font-size: 1.75rem;
          color: #0070f3;
          margin-bottom: 10px;
        }

        .hotel-description {
          flex-grow: 1;
          font-size: 1rem;
          color: #555;
          margin-bottom: 15px;
        }

        .hotel-area {
          font-size: 1rem;
          color: #888;
          margin: 5px 0;
        }

        .hotel-rating {
          display: flex;
          justify-content: center;
          margin-bottom: 15px;
        }

        .star {
          font-size: 20px;
          color: #ddd;
          width: 20px;
          height: 20px;
          display: inline-block;
          line-height: 20px;
          text-align: center;
          margin: 0 2px;
          position: relative;
        }

        .star.filled {
          color: #ffcc00;
        }

        .star.partial {
          color: transparent;
          background-clip: text;
          -webkit-background-clip: text;
        }

        .book-button {
          padding: 12px;
          background-color: #0070f3;
          color: #fff;
          border: none;
          border-radius: 25px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: bold;
          transition: background-color 0.3s, transform 0.2s;
        }

        .book-button:hover {
          background-color: #005bb5;
          transform: translateY(-2px);
        }

        @media (max-width: 600px) {
          .filter-section {
            flex-direction: column;
          }

          .styled-input {
            width: 100%;
            max-width: none;
          }

          .rating-filter,
          .area-filter {
            width: 100%;
            max-width: none;
          }

          .hotel-card {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
