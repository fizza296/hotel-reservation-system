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
};

export default function RoomsPage() {
  const [hotelName, setHotelName] = useState<string | null>(null);
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
      const data = await res.json();

      // Set hotel name, rooms, and reviews
      setHotelName(data.hotelName || "Unknown Hotel");
      setRooms(Array.isArray(data.rooms) ? data.rooms : []);
      setReviews(Array.isArray(data.reviews) ? data.reviews : []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setHotelName(null);
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
      wifi: <FontAwesomeIcon icon={faWifi} />,
      tv: <FontAwesomeIcon icon={faTv} />,
      ac: <FontAwesomeIcon icon={faSnowflake} />,
      "mini fridge": <FontAwesomeIcon icon={faUtensils} />,
      parking: <FontAwesomeIcon icon={faCar} />,
      pool: <FontAwesomeIcon icon={faSwimmingPool} />,
      view: <FontAwesomeIcon icon={faBinoculars} />,
      balcony: <FontAwesomeIcon icon={faHouseUser} />,
    };

    return (
      <div className="amenities">
        {amenitiesList.map((amenity) => (
          <div key={amenity} className="amenity">
            {icons[amenity.toLowerCase()] || (
              <FontAwesomeIcon icon={faQuestionCircle} />
            )}
            <span className="amenity-text">{amenity}</span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div>Loading rooms and reviews...</div>;
  }

  return (
    <div className="page-container">
      {/* Hotel Name */}
      <header className="hotel-header">
        <h1>{hotelName}</h1>
      </header>

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
          reviews.map((review, index) => (
            <div key={index} className="review">
              <p>{review.review_text}</p>
              <small>{new Date(review.created_at).toLocaleString()}</small>
            </div>
          ))
        ) : (
          <p>No reviews available for this hotel.</p>
        )}
      </div>

      {/* Styles */}
    <style jsx>{`
  .page-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    background-color: #f5f5f5;
  }

  .hotel-header h1 {
    font-size: 2.5rem;
    font-weight: bold;
    color: #003e75;
    text-align: center;
    letter-spacing: 1.5px;
    text-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  }

  .rooms-section,
  .reviews-section {
    padding: 20px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .room-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }

  .room-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(145deg, #ffffff, #f0f0f0);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1), inset 0 1px 2px #ffffff;
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
    width: 100%;
  }

  .room-type {
    font-size: 1.2rem;
    font-weight: bold;
    color: #333;
  }

  .room-status {
    font-size: 1rem;
    font-weight: bold;
    padding: 5px 10px;
    border-radius: 5px;
    color: #fff;
  }

  .available {
    background-color: #4caf50;
  }

  .unavailable {
    background-color: #f44336;
  }

  .room-body {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin: 10px 0;
  }

  .amenity {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .amenity-text {
    font-size: 0.9rem;
    color: #555;
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
  }

  .book-room-button:hover {
    transform: scale(1.1);
    background: linear-gradient(90deg, #005bb5, #003e75);
  }

  .review {
    background: linear-gradient(145deg, #f9f9f9, #e9e9e9);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1), inset 0 1px 2px #ffffff;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 10px;
  }

  .review p {
    font-size: 1rem;
    color: #333;
    margin-bottom: 5px;
  }

  .review small {
    font-size: 0.85rem;
    color: #555;
  }
`}</style>

    </div>
  );
}
