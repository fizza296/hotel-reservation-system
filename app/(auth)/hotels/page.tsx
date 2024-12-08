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
            background-color: #f9fafb;
          }

          .spinner {
            border: 8px solid #e5e7eb;
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
        <p>No hotels available at the moment.</p>
        <style jsx>{`
          .no-hotels {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 80vh;
            font-size: 1.5rem;
            color: #6b7280;
            background-color: #f9fafb;
          }
        `}</style>
      </div>
    );
  }

  // Handle booking navigation
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
          {[5, 4, 3, 2, 1].map((rating) => (
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
              <div className="hotel-image-container">
                <img src={hotel.image_link} alt={hotel.name} className="hotel-image" />
                <div className="rating-badge">
                  {hotel.rating.toFixed(1)} ★
                </div>
              </div>
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
                    const isHalf = index === Math.floor(hotel.rating) && hotel.rating % 1 >= 0.5;

                    return (
                      <span key={index} className={`star ${isFull ? "filled" : isHalf ? "half" : ""}`}>
                        ★
                      </span>
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

        .hotel-container {
          width: 100%;
          margin: 0;
          padding: 0;
          background-color: #f9fafb;
          font-family: 'Inter', sans-serif;
        }

        .header-section {
          width: 100%;
          padding: 60px 20px;
          background: linear-gradient(135deg, #1e3a8a, #3b82f6);
          text-align: center;
          color: #ffffff;
          position: relative;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
          width: 80px;
          height: 4px;
          background-color: #ffcc00;
          margin: 12px auto 0 auto;
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
          margin: 40px 20px 30px 20px;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          position: relative;
          z-index: 2;
        }

        .styled-input {
          padding: 12px 20px;
          border: 2px solid #e5e7eb;
          border-radius: 30px;
          outline: none;
          font-size: 1rem;
          transition: border-color 0.3s, box-shadow 0.3s;
          color: #4b5563;
          background-color: #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .styled-input::placeholder {
          color: #9ca3af;
        }

        .styled-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
          background-color: #ffffff;
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
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 30px;
        }

        .hotel-card {
          display: flex;
          flex-direction: column;
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .hotel-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 24px rgba(0, 0, 0, 0.15);
        }

        .hotel-image-container {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
        }

        .hotel-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .hotel-card:hover .hotel-image {
          transform: scale(1.05);
        }

        .rating-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background-color: rgba(59, 130, 246, 0.9);
          color: #ffffff;
          padding: 5px 10px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .hotel-info {
          display: flex;
          flex-direction: column;
          padding: 20px;
        }

        .hotel-name {
          font-size: 1.6rem;
          color: #1e3a8a;
          margin-bottom: 10px;
          font-weight: 700;
          transition: color 0.3s;
        }

        .hotel-name:hover {
          color: #3b82f6;
        }

        .hotel-description {
          font-size: 0.95rem;
          color: #6b7280;
          margin-bottom: 12px;
          flex-grow: 1;
          line-height: 1.6;
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
          align-items: center;
          margin-bottom: 16px;
        }

        .star {
          font-size: 18px;
          color: #d1d5db;
          margin-right: 4px;
          transition: color 0.3s;
        }

        .star.filled {
          color: #f59e0b;
        }

        .star.half {
          position: relative;
          color: #f59e0b;
        }

        .star.half::after {
          content: '★';
          position: absolute;
          left: 0;
          top: 0;
          width: 50%;
          overflow: hidden;
          color: #d1d5db;
        }

        .book-button {
          padding: 12px 20px;
          background-color: #3b82f6;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 600;
          text-align: center;
          transition: background-color 0.3s, transform 0.2s;
          align-self: flex-start;
        }

        .book-button:hover {
          background-color: #2563eb;
          transform: translateY(-2px);
        }

        /* Responsive Design */

        @media (max-width: 1024px) {
          .hotel-list {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          }

          .hotel-image-container {
            height: 180px;
          }

          .hotel-name {
            font-size: 1.5rem;
          }

          .hotel-description {
            font-size: 0.9rem;
          }
        }

        @media (max-width: 768px) {
          .hotel-list {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          }

          .hotel-image-container {
            height: 160px;
          }

          .hotel-name {
            font-size: 1.4rem;
          }

          .book-button {
            font-size: 0.95rem;
            padding: 10px 18px;
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
            margin: 30px 15px;
            padding: 15px;
          }

          .styled-input {
            width: 100%;
            max-width: 280px;
          }

          .hotel-list {
            grid-template-columns: 1fr;
          }

          .hotel-image-container {
            height: 140px;
          }

          .hotel-name {
            font-size: 1.3rem;
            text-align: center;
          }

          .hotel-description {
            font-size: 0.85rem;
            text-align: center;
          }

          .hotel-info {
            padding: 15px;
          }

          .book-button {
            font-size: 0.9rem;
            padding: 8px 16px;
            align-self: center;
          }
        }
      `}</style>
    </div>
  );
}
