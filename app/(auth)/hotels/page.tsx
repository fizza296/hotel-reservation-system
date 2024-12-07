"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
            justify-content: center;
            align-items: center;
            height: 80vh;
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
            font-size: 1.5rem;
            color: #333;
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
      <div className="header-section">
        <h1 className="page-title">Explore Our Hotels</h1>
        <h2 className="page-subtitle">Discover world-class hospitality</h2>
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
                    fill="#4169E1"
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
                    const isPartial =
                      index === Math.floor(hotel.rating) && hotel.rating % 1 !== 0;

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
  background-color: #fff;
}

.header-section {
  position: relative;
  width: 100%;
  padding: 20px 20px;
  background: linear-gradient(135deg, #1e3a8a, #3b82f6);
  text-align: center;
  color: #fff;
  margin-top: -20px;
  margin-bottom: 40px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.page-title {
  font-size: 3rem;
  font-weight: bold;
  margin: 0 0 10px 0;
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
  margin-bottom: 30px;
  width: 100%;
  padding-top: 20px;
}

.filter-section select,
.filter-section input {
  padding: 10px 16px;
  border: 2px solid #ccc;
  border-radius: 30px;
  font-size: 0.9rem; /* Reduce font size for smaller input fields */
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
  color: #000;
  background-color: #f9f9f9;
  vertical-align: middle; /* Ensures alignment with other elements */
}

.filter-section select:focus,
.filter-section input:focus {
  border-color: #0070f3;
  box-shadow: 0 0 5px rgba(0, 112, 243, 0.3);
}

.filter-section svg {
  font-size: 0.85rem; /* Reduce icon size */
  margin-top: 2px; /* Moves the icon slightly lower */
  vertical-align: middle; /* Keeps alignment consistent */
}


        .styled-input {
          padding: 14px 24px;
          border: 2px solid #ccc;
          border-radius: 30px;
          outline: none;
          font-size: 1.1rem;
          transition: border-color 0.3s, box-shadow 0.3s;
          color: #000;
          background-color: #f9f9f9;
        }

        .rating-filter,
        .area-filter {
          width: 200px;
        }

        .styled-input:focus {
          border-color: #0070f3;
          box-shadow: 0 0 10px rgba(0,112,243,0.3);
          background-color: #fff;
        }

        .hotel-display {
          width: 100%;
          padding: 0 20px 40px 20px;
        }

        .hotel-list {
          display: grid;
          grid-template-columns: 1fr; /* One card per row */
          gap: 30px;
          width: 100%;
        }

        .hotel-card {
          display: flex;
          flex-direction: row;
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          padding: 15px;
          align-items: center;
          width: 100%;
        }

        .hotel-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
        }

        .hotel-image {
          width: 120px;
          height: 120px;
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
          font-size: 1.4rem;
          color: #000;
          margin-bottom: 8px;
          font-weight: bold;
          line-height: 1.2;
        }

        .hotel-description {
          font-size: 0.95rem;
          color: #333;
          margin-bottom: 8px;
          flex-grow: 1;
          line-height: 1.3;
        }

        .hotel-area {
          font-size: 0.9rem;
          color: #555;
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }

        .location-icon {
          margin-right: 5px;
        }

        .hotel-rating {
          display: flex;
          margin-bottom: 10px;
        }

        .star {
          font-size: 16px;
          color: #ddd;
          width: 16px;
          height: 16px;
          line-height: 16px;
          text-align: center;
          margin-right: 2px;
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
          display: block;
          margin: 0 auto; /* Center the button horizontally */
          padding: 6px 12px; /* Make the button smaller */
          background-color: #0070f3;
          color: #fff;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: bold;
          transition: background-color 0.3s, transform 0.2s;
        }

        .book-button:hover {
          background-color: #005bb5;
          transform: translateY(-2px);
        }

        @media (max-width: 480px) {
          .page-title {
            font-size: 2.5rem;
          }

          .hotel-card {
            padding: 10px;
          }

          .hotel-image {
            width: 80px;
            height: 80px;
          }

          .hotel-name {
            font-size: 1.2rem;
          }

          .hotel-description {
            font-size: 0.85rem;
          }

          .hotel-area {
            font-size: 0.85rem;
          }

          .book-button {
            font-size: 0.8rem;
            padding: 5px 10px;
          }
        }
      `}</style>
    </div>
  );
}
