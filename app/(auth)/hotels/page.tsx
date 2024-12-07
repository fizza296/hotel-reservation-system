"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Hotel = {
  hotel_id: number;
  name: string;
  description?: string;
  image_link: string;
  rating: number;
  area: string;
};

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState(0);
  const [filterArea, setFilterArea] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const areaParam = searchParams.get("area") || "";
    setFilterArea(areaParam); // Set initial filter based on query parameter

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
  }, [searchParams]);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <style jsx>{`
          .loader-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 80vh;
            background-color: #f0f4f8;
          }

          .spinner {
            border: 8px solid #f3f3f3;
            border-top: 8px solid #3b82f6;
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
            font-size: 1.5rem;
            color: #555;
            background-color: #f0f4f8;
          }
        `}</style>
      </div>
    );
  }

  // Filter hotels based on the search query, rating, and area
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
      <div className="header-section">
        <h1 className="page-title">Explore Our Exquisite Hotels</h1>
        <p className="page-subtitle">Discover unparalleled comfort and luxury</p>
      </div>
      <div className="filter-section">
        <input
          type="text"
          placeholder="Search hotels..."
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
              {rating} Star{rating > 1 ? "s" : ""}
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
      <div className="hotel-display">
        <div className="hotel-list">
          {filteredHotels.map((hotel) => (
            <div key={hotel.hotel_id} className="hotel-card">
              <img src={hotel.image_link} alt={hotel.name} className="hotel-image" />
              <div className="hotel-info">
                <h2 className="hotel-name">{hotel.name}</h2>
                <p className="hotel-description">
                  {hotel.description && hotel.description.trim() !== ""
                    ? hotel.description
                    : "Experience unparalleled comfort and exceptional service at our hotel, designed to make your stay memorable."}
                </p>
                <p className="hotel-area">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="location-icon"
                    viewBox="0 0 24 24"
                    fill="#3b82f6"
                    width="16px"
                    height="16px"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                  </svg>
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
                  aria-label={`Book now at ${hotel.name}`}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .hotel-container {
          width: 100%;
          margin: 0;
          padding: 0;
          background-color: #f0f4f8;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .header-section {
          width: 100%;
          padding: 60px 20px 40px 20px;
          background: linear-gradient(135deg, #1e3a8a, #3b82f6);
          text-align: center;
          color: #fff;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          position: relative;
          z-index: 1;
        }

        .page-title {
          font-size: 3rem;
          font-weight: 700;
          margin: 0 0 10px 0;
          position: relative;
        }

        /* Decorative underline for title */
        .page-title::after {
          content: '';
          display: block;
          width: 60px;
          height: 4px;
          background-color: #ffcc00;
          margin: 10px auto 0 auto;
          border-radius: 2px;
        }

        .page-subtitle {
          font-size: 1.2rem;
          font-weight: 400;
          margin: 0;
          opacity: 0.9;
        }

        .filter-section {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          justify-content: center;
          align-items: center;
          margin: 0 20px 30px 20px; /* Adjusted margin for spacing */
          padding: 20px;
          background-color: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          position: relative;
          z-index: 2;
        }

        .styled-input {
          padding: 12px 20px;
          border: 2px solid #ccc;
          border-radius: 30px;
          outline: none;
          font-size: 1rem;
          transition: border-color 0.3s, box-shadow 0.3s;
          color: #333;
          background-color: #fff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .styled-input::placeholder {
          color: #888;
        }

        .styled-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
          background-color: #fff;
        }

        .rating-filter,
        .area-filter {
          width: 180px;
        }

        .search-input {
          flex: 1 1 250px;
          max-width: 300px;
        }

        .hotel-display {
          width: 100%;
          padding: 0 20px 40px 20px;
        }

        .hotel-list {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .hotel-card {
          display: flex;
          flex-direction: row;
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          padding: 15px;
          align-items: center;
        }

        .hotel-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 24px rgba(0, 0, 0, 0.2);
        }

        .hotel-image {
          width: 200px;
          height: 150px;
          object-fit: cover;
          border-radius: 8px;
          flex-shrink: 0;
        }

        .hotel-info {
          display: flex;
          flex-direction: column;
          margin-left: 20px;
          flex: 1;
        }

        .hotel-name {
          font-size: 1.6rem;
          color: #1e3a8a;
          margin-bottom: 10px;
          font-weight: 700;
        }

        .hotel-description {
          font-size: 0.95rem;
          color: #555;
          margin-bottom: 12px;
          flex-grow: 1;
          line-height: 1.5;
        }

        .hotel-area {
          font-size: 0.9rem;
          color: #3b82f6;
          display: flex;
          align-items: center;
          margin-bottom: 12px;
        }

        .location-icon {
          margin-right: 6px;
        }

        .hotel-rating {
          display: flex;
          margin-bottom: 16px;
        }

        .star {
          font-size: 18px;
          color: #ddd;
          width: 18px;
          height: 18px;
          line-height: 18px;
          text-align: center;
          margin-right: 3px;
          position: relative;
          transition: color 0.3s;
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
  padding: 10px 20px;
  background-color: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 5px; /* Adjusted to make the button more squared */
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  transition: background-color 0.3s, transform 0.2s;
  align-self: flex-start;
  width: auto;
}


        .book-button:hover {
          background-color: #1e40af;
          transform: translateY(-2px);
        }

        /* Responsive Design */

        @media (max-width: 1024px) {
          .hotel-card {
            flex-direction: column;
            align-items: flex-start;
          }

          .hotel-image {
            width: 100%;
            height: 180px;
            margin-bottom: 15px;
          }

          .hotel-info {
            margin-left: 0;
          }

          .book-button {
            align-self: center;
          }
        }

        @media (max-width: 768px) {
          .hotel-image {
            height: 160px;
          }

          .hotel-name {
            font-size: 1.4rem;
          }

          .hotel-description {
            font-size: 0.9rem;
          }

          .book-button {
            font-size: 0.95rem;
            padding: 8px 16px;
          }
        }

        @media (max-width: 480px) {
          .header-section {
            padding: 40px 15px 30px 15px;
          }

          .page-title {
            font-size: 2.5rem;
          }

          .page-subtitle {
            font-size: 1rem;
          }

        .filter-section {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  align-items: center;
  margin: 40px 20px 30px 20px; /* Adjusted the top margin to move the filters down */
  padding: 20px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 2;
}


          .styled-input {
            width: 100%;
            max-width: 300px;
          }

          .hotel-card {
            flex-direction: column;
            align-items: center;
          }

          .hotel-image {
            height: 140px;
          }

          .hotel-name {
            font-size: 1.2rem;
            text-align: center;
          }

          .hotel-description {
            font-size: 0.85rem;
            text-align: center;
          }

          .book-button {
            font-size: 0.9rem;
            padding: 8px 16px;
          }
        }
      `}</style>
    </div>
  );
}
