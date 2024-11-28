"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
          rooms.map((room) => (
            <div key={room.room_id} className="room-card">
              <h3 className="room-type">Room Type: {room.room_type}</h3>
              <p className="room-amenities">Amenities: {room.amenities}</p>
              <p
                className={`room-status ${
                  room.is_available ? "available" : "unavailable"
                }`}
              >
                Status: {room.is_available ? "Available" : "Unavailable"}
              </p>
              {room.is_available && (
                <button
                  className="book-room-button"
                  onClick={() => goToBookingPage(room.room_id)}
                >
                  Book Room
                </button>
              )}
            </div>
          ))
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

        .hotel-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .hotel-header h1 {
          font-size: 2rem;
          color: #0070f3;
        }

        .rooms-section,
        .reviews-section {
          padding: 20px;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        h2 {
          margin-bottom: 20px;
          font-size: 1.5rem;
          color: #333;
        }

        .room-card {
          background: #f9f9f9;
          border-radius: 10px;
          padding: 15px;
          margin-bottom: 20px;
        }

        .room-type {
          font-size: 1.2rem;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .room-amenities {
          margin-bottom: 10px;
          color: #555;
        }

        .room-status {
          margin-bottom: 15px;
          padding: 5px 10px;
          border-radius: 5px;
          display: inline-block;
          font-weight: bold;
          color: #fff;
        }

        .available {
          background-color: #4caf50;
        }

        .unavailable {
          background-color: #f44336;
        }

        .book-room-button {
          padding: 10px 20px;
          background-color: #0070f3;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .book-room-button:hover {
          background-color: #005bb5;
        }

        .review {
          background-color: #e9e9e9;
          padding: 10px;
          border-radius: 5px;
          margin-bottom: 10px;
        }

        .review small {
          display: block;
          margin-top: 5px;
          color: #777;
        }
      `}</style>
    </div>
  );
}


