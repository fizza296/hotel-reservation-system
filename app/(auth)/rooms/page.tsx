// pages/rooms.tsx

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWifi,
  faTv,
  faSnowflake,
  faUtensils,
  faCar,
  faSwimmingPool,
  faBinoculars,
  faHouseUser,
  faQuestionCircle,
  faPhone,
  faGlobe,
  faMapMarkerAlt,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

type Room = {
  room_id: number;
  room_type: string;
  is_available: boolean;
  amenities: string;
};

type Review = {
  review_text: string;
  created_at: string;
  rating: number;
  reviewer_name: string;
  // Optionally, add reviewer_avatar: string;
};

type Hotel = {
  name: string;
  formatted_address: string;
  description: string;
  rating: number;
  phone_number: string;
  website_url: string;
  google_maps_url: string;
  image_link: string;
};

export default function RoomsPage() {
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [hotelId, setHotelId] = useState<string | null>(null);
  const router = useRouter();

  const fetchRoomsAndReviews = async () => {
    if (!hotelId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/rooms?hotel_id=${hotelId}`);
      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }
      const data = await res.json();

      // Set hotel details, rooms, and reviews
      setHotel(data.hotel || null);
      setRooms(Array.isArray(data.rooms) ? data.rooms : []);
      setReviews(Array.isArray(data.reviews) ? data.reviews : []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setHotel(null);
      setRooms([]);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("hotel_id");
    setHotelId(id);
  }, []);

  useEffect(() => {
    if (hotelId) {
      fetchRoomsAndReviews();
    }
  }, [hotelId]);

  const goToBookingPage = (roomId: number) => {
    router.push(`/bookings?hotel_id=${hotelId}&room_id=${roomId}`);
  };

  const renderAmenities = (amenities: string) => {
    const amenitiesList = amenities.split(", ");
    const icons: Record<string, JSX.Element> = {
      wifi: <FontAwesomeIcon icon={faWifi} color="#4CAF50" />,
      tv: <FontAwesomeIcon icon={faTv} color="#2196F3" />,
      ac: <FontAwesomeIcon icon={faSnowflake} color="#00BCD4" />,
      "mini fridge": <FontAwesomeIcon icon={faUtensils} color="#FF9800" />,
      parking: <FontAwesomeIcon icon={faCar} color="#9C27B0" />,
      pool: <FontAwesomeIcon icon={faSwimmingPool} color="#3F51B5" />,
      view: <FontAwesomeIcon icon={faBinoculars} color="#795548" />,
      balcony: <FontAwesomeIcon icon={faHouseUser} color="#E91E63" />,
    };

    return (
      <div className="amenities">
        {amenitiesList.map((amenity) => (
          <div key={amenity} className="amenity">
            {icons[amenity.toLowerCase()] || (
              <FontAwesomeIcon icon={faQuestionCircle} color="#9E9E9E" />
            )}
            <span className="amenity-text">{amenity}</span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading rooms and reviews...</div>;
  }

  if (!hotel) {
    return <div className="error">Hotel not found or an error occurred.</div>;
  }

  return (
    <div className="page-container">
      {/* Hotel Banner */}
      {hotel.image_link && (
        <div className="hotel-banner">
          <img src={hotel.image_link} alt={`${hotel.name} Image`} />
        </div>
      )}

      {/* Hotel Details */}
      <div className="hotel-details">
        <h1 className="hotel-name">{hotel.name}</h1>
        <div className="hotel-info">
          <div className="info-item">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="info-icon" />
            <span>{hotel.formatted_address}</span>
          </div>
          <div className="info-item">
            <FontAwesomeIcon icon={faPhone} className="info-icon" />
            <span>{hotel.phone_number || "N/A"}</span>
          </div>
          <div className="info-item">
            <FontAwesomeIcon icon={faGlobe} className="info-icon" />
            {hotel.website_url ? (
              <a href={hotel.website_url} target="_blank" rel="noopener noreferrer">
                Visit Website
              </a>
            ) : (
              <span>N/A</span>
            )}
          </div>
          <div className="info-item rating">
            <FontAwesomeIcon icon={faStar} className="info-icon" />
            <span>Rating: {hotel.rating}/5</span>
          </div>
        </div>
        {hotel.description && <p className="hotel-description">{hotel.description}</p>}
        {hotel.google_maps_url && (
          <a
            href={hotel.google_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="map-link"
          >
            View on Google Maps
          </a>
        )}
      </div>

      {/* Rooms Section */}
      <div className="rooms-section">
        <h2>Rooms</h2>
        {rooms.length > 0 ? (
          <div className="room-container">
            {rooms.map((room) => (
              <div key={room.room_id} className="room-card">
                <div className="room-header">
                  <h3 className="room-type">{room.room_type}</h3>
                  <p
                    className={`room-status ${
                      room.is_available ? "available" : "unavailable"
                    }`}
                  >
                    {room.is_available ? "Available" : "Unavailable"}
                  </p>
                </div>
                <div className="room-body">
                  {renderAmenities(room.amenities)}
                </div>
                {room.is_available && (
                  <button
                    className="book-room-button"
                    onClick={() => goToBookingPage(room.room_id)}
                  >
                    Book Room
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No rooms available for this hotel.</p>
        )}
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h2>Reviews</h2>
        {reviews.length > 0 ? (
          <div className="reviews-container">
            {reviews.map((review, index) => (
              <div key={index} className="review-card">
                <div className="review-header">
                  {/* Optional: Reviewer Avatar */}
                  {/* 
                  {review.reviewer_avatar && (
                    <img src={review.reviewer_avatar} alt={`${review.reviewer_name} Avatar`} className="review-avatar" />
                  )}
                  */}
                  <div className="reviewer-info">
                    <p className="reviewer-name">{review.reviewer_name}</p>
                    <div className="review-rating">
                      {[...Array(5)].map((star, i) => (
                        <FontAwesomeIcon
                          key={i}
                          icon={faStar}
                          color={i < review.rating ? "#FFD700" : "#E0E0E0"}
                        />
                      ))}
                      <span className="rating-text">{review.rating}/5</span>
                    </div>
                  </div>
                </div>
                <p className="review-text">"{review.review_text}"</p>
                <div className="review-footer">
                  <small>{new Date(review.created_at).toLocaleString()}</small>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No reviews available for this hotel.</p>
        )}
      </div>

      {/* Styles */}
      <style jsx>{`
        .page-container {
          display: flex;
          flex-direction: column;
          gap: 30px;
          padding: 20px;
          background-color: #f5f5f5;
        }

        /* Hotel Banner */
        .hotel-banner {
          width: 100%;
          max-height: 400px;
          overflow: hidden;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .hotel-banner img {
          width: 100%;
          height: auto;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .hotel-banner img:hover {
          transform: scale(1.05);
        }

        /* Hotel Details */
        .hotel-details {
          padding: 20px;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .hotel-name {
          font-size: 2.5rem;
          font-weight: bold;
          color: #003e75;
          text-align: center;
          margin-bottom: 10px;
        }

        .hotel-info {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 20px;
          margin-bottom: 15px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1rem;
          color: #555;
        }

        .info-icon {
          color: #003e75;
        }

        .hotel-description {
          font-size: 1.1rem;
          color: #333;
          line-height: 1.6;
          text-align: justify;
        }

        .map-link {
          display: inline-block;
          margin-top: 10px;
          color: #0070f3;
          text-decoration: none;
          font-weight: bold;
          transition: color 0.3s ease;
        }

        .map-link:hover {
          color: #005bb5;
        }

        /* Rooms Section */
        .rooms-section {
          padding: 20px;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .rooms-section h2 {
          font-size: 2rem;
          color: #003e75;
          margin-bottom: 20px;
          text-align: center;
        }

        .room-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        @media (max-width: 1200px) {
          .room-container {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .room-container {
            grid-template-columns: 1fr;
          }
        }

        .room-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: linear-gradient(145deg, #ffffff, #f0f0f0);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1),
            inset 0 1px 2px #ffffff;
          border-radius: 10px;
          padding: 20px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .room-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        .room-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .room-type {
          font-size: 1.3rem;
          font-weight: bold;
          color: #333;
        }

        .room-status {
          font-size: 0.9rem;
          font-weight: bold;
          padding: 5px 10px;
          border-radius: 5px;
          color: #fff;
          text-transform: uppercase;
        }

        .available {
          background-color: #4caf50;
        }

        .unavailable {
          background-color: #f44336;
        }

        .room-body {
          display: flex;
          align-items: center;
          overflow-x: auto;
          white-space: nowrap;
          padding-bottom: 10px;
          margin-bottom: 15px;
          border-bottom: 1px solid #ddd;
        }

        .amenities {
          display: flex;
          gap: 10px;
          padding: 10px 0;
          flex-wrap: nowrap;
        }

        .amenity {
          display: flex;
          align-items: center;
          gap: 5px;
          background: #e0e0e0;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 0.9rem;
          color: #555;
          flex-shrink: 0;
        }

        .amenity-text {
          font-size: 0.9rem;
        }

        .book-room-button {
          padding: 10px 20px;
          background: linear-gradient(90deg, #0070f3, #005bb5);
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.3s ease, transform 0.3s ease;
          align-self: center;
        }

        .book-room-button:hover {
          transform: scale(1.05);
          background: linear-gradient(90deg, #005bb5, #003e75);
        }

        /* Reviews Section */
        .reviews-section {
          padding: 20px;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .reviews-section h2 {
          font-size: 2rem;
          color: #003e75;
          margin-bottom: 20px;
          text-align: center;
        }

        .reviews-container {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .review-card {
          background: linear-gradient(145deg, #f9f9f9, #e9e9e9);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1),
            inset 0 1px 2px #ffffff;
          padding: 20px;
          border-radius: 10px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .review-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
        }

        .review-header {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }

        /* Optional: Reviewer Avatar */
        /* 
        .review-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          margin-right: 10px;
        }
        */

        .reviewer-info {
          display: flex;
          flex-direction: column;
        }

        .reviewer-name {
          font-weight: bold;
          color: #003e75;
          margin-bottom: 5px;
        }

        .review-rating {
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .rating-text {
          margin-left: 5px;
          font-size: 0.9rem;
          color: #555;
        }

        .review-text {
          font-size: 1.1rem;
          color: #333;
          margin-bottom: 10px;
          font-style: italic;
        }

        .review-footer {
          display: flex;
          justify-content: flex-end;
        }

        .review-footer small {
          font-size: 0.85rem;
          color: #555;
        }

        /* Loading and Error States */
        .loading,
        .error {
          text-align: center;
          font-size: 1.2rem;
          color: #555;
          padding: 50px 0;
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .room-container {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .room-container {
            grid-template-columns: 1fr;
          }

          .room-body {
            justify-content: flex-start;
          }

          .amenities {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
}
