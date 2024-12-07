"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  faConciergeBell, // Room Service
  faCoffee,         // Coffee Maker
  faFan,            // Air Purifier
  faQuestionCircle,
  faPhone,
  faGlobe,
  faMapMarkerAlt,
  faStar,
  faLock,           // Safe
  faSpa,            // Hair Dryer (Alternative)
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
  const [userId, setUserId] = useState<string | null>(null); // Added userId state
  const [newReview, setNewReview] = useState({ review_text: "", rating: 0 });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  // Mapping amenities to icons
  const icons: Record<string, JSX.Element> = {
    wifi: <FontAwesomeIcon icon={faWifi} color="#4CAF50" />,
    "wi-fi": <FontAwesomeIcon icon={faWifi} color="#4CAF50" />, // Mapping both "wifi" and "wi-fi"
    tv: <FontAwesomeIcon icon={faTv} color="#2196F3" />,
    ac: <FontAwesomeIcon icon={faSnowflake} color="#00BCD4" />,
    "mini fridge": <FontAwesomeIcon icon={faUtensils} color="#FF9800" />,
    parking: <FontAwesomeIcon icon={faCar} color="#9C27B0" />,
    pool: <FontAwesomeIcon icon={faSwimmingPool} color="#3F51B5" />,
    view: <FontAwesomeIcon icon={faBinoculars} color="#795548" />,
    balcony: <FontAwesomeIcon icon={faHouseUser} color="#E91E63" />,
    "room service": <FontAwesomeIcon icon={faConciergeBell} color="#FFC107" />,
    "coffee maker": <FontAwesomeIcon icon={faCoffee} color="#FF5722" />,
    "air purifier": <FontAwesomeIcon icon={faFan} color="#607D8B" />,
    "hair dryer": <FontAwesomeIcon icon={faSpa} color="#9C27B0" />, // Alternative for Hair Dryer
    safe: <FontAwesomeIcon icon={faLock} color="#607D8B" />,        // Safe
  };

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
    const params = new URLSearchParams(window.location.search);
    const id = params.get("hotel_id");
    let uid = params.get("user_id"); // Extract user_id from URL

    if (!uid) {
      uid = "1"; // Set a default user_id for testing
      console.warn("user_id not found in URL. Using default user_id = 1 for testing.");
      setUserId(uid);
    } else {
      setUserId(uid);
    }

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
    // Split amenities by comma and space, then trim and lowercase each amenity
    const amenitiesList = amenities.split(", ").map((amenity) => amenity.trim().toLowerCase());

    return (
      <div className="flex flex-wrap gap-4">
        {amenitiesList.map((amenity) => (
          <div key={amenity} className="flex items-center gap-1 text-gray-700">
            {icons[amenity] || (
              <FontAwesomeIcon icon={faQuestionCircle} color="#9E9E9E" />
            )}
            <span className="text-sm">
              {amenity
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const handleReviewSubmit = async () => {
    if (!userId) {
      setErrorMessage("User ID is missing. Please provide a valid user ID.");
      return;
    }

    if (!newReview.review_text || newReview.rating === 0) {
      setErrorMessage("Please provide a review text and rating.");
      return;
    }

    // Validate that userId is a number
    const parsedUserId = parseInt(userId, 10);
    if (isNaN(parsedUserId)) {
      setErrorMessage("Invalid User ID format.");
      return;
    }

    try {
      const res = await fetch(`/api/auth/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hotel_id: hotelId, user_id: parsedUserId, ...newReview }),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Error: ${res.status}`);
      }

      const newReviewResponse: Review = await res.json();
      setReviews([newReviewResponse, ...reviews]);
      setNewReview({ review_text: "", rating: 0 });
      setErrorMessage("");
      setSuccessMessage("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      setErrorMessage("An error occurred. Please try again.");
      setSuccessMessage("");
    }
  };

  const renderReviewForm = () => {
    if (!userId) {
      return (
        <div className="add-review-section">
          <h3 className="text-xl font-semibold text-gray-800">Please provide a valid User ID to add a review</h3>
          {/* Optional: Add an input field to allow manual entry */}
          <input
            type="number"
            placeholder="Enter your User ID"
            value={userId || ""}
            onChange={(e) => setUserId(e.target.value)}
            className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      );
    }

    return (
      <div className="add-review-section">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Add a Review</h3>
        {errorMessage && <p className="mb-2 text-red-500">{errorMessage}</p>}
        {successMessage && <p className="mb-2 text-green-500">{successMessage}</p>}
        <textarea
          placeholder="Write your review..."
          value={newReview.review_text}
          onChange={(e) =>
            setNewReview((prev) => ({ ...prev, review_text: e.target.value }))
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={4}
        />
        <div className="rating-input flex items-center mt-4 mb-4">
          {[...Array(5)].map((_, i) => (
            <FontAwesomeIcon
              key={i}
              icon={faStar}
              color={i < newReview.rating ? "#FFD700" : "#E0E0E0"}
              onClick={() => setNewReview((prev) => ({ ...prev, rating: i + 1 }))}
              className="rating-icon text-2xl cursor-pointer transition-transform duration-200 hover:scale-110"
            />
          ))}
        </div>
        <button
          onClick={handleReviewSubmit}
          className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-2 px-4 rounded-md hover:from-green-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Submit Review
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loader-container flex items-center justify-center min-h-screen bg-gray-100">
        <div className="spinner"></div>
        <style jsx>{`
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

  if (!hotel) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-lg font-semibold text-red-500">Hotel not found or an error occurred.</div>
      </div>
    );
  }

  return (
    <div className="page-container max-w-7xl mx-auto px-4 py-8 bg-gray-50">
      {/* Hotel Banner */}
      {hotel.image_link && (
        <div className="hotel-banner mb-8">
          <img
            src={hotel.image_link}
            alt={`${hotel.name} Image`}
            className="w-full h-64 object-cover rounded-lg shadow-md hover:transform hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      {/* Hotel Details */}
      <div className="hotel-details mb-12 bg-white p-6 rounded-lg shadow-md">
        <h1 className="hotel-name text-3xl font-bold text-blue-700 mb-4">{hotel.name}</h1>
        <div className="hotel-info flex flex-col sm:flex-row sm:flex-wrap sm:justify-between mb-4">
          <div className="info-item flex items-center gap-2 mb-2 sm:mb-0">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-500" />
            <span className="text-gray-700">{hotel.formatted_address}</span>
          </div>
          <div className="info-item flex items-center gap-2 mb-2 sm:mb-0">
            <FontAwesomeIcon icon={faPhone} className="text-blue-500" />
            <span className="text-gray-700">{hotel.phone_number || "N/A"}</span>
          </div>
          <div className="info-item flex items-center gap-2 mb-2 sm:mb-0">
            <FontAwesomeIcon icon={faGlobe} className="text-blue-500" />
            {hotel.website_url ? (
              <a href={hotel.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                Visit Website
              </a>
            ) : (
              <span className="text-gray-700">N/A</span>
            )}
          </div>
          <div className="info-item flex items-center gap-2">
            <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
            <span className="text-gray-700">Rating: {hotel.rating}/5</span>
          </div>
        </div>
        {hotel.description && <p className="hotel-description text-gray-700 mb-4">{hotel.description}</p>}
        {hotel.google_maps_url && (
          <a
            href={hotel.google_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
          >
            View on Google Maps
          </a>
        )}
      </div>

      {/* Rooms Section */}
      <div className="rooms-section mb-12">
        <h2 className="text-2xl font-semibold text-blue-700 mb-6">Rooms</h2>
        {rooms.length > 0 ? (
          <div className="room-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div key={room.room_id} className="room-card bg-gradient-to-br from-white to-gray-100 p-6 rounded-lg shadow-md flex flex-col justify-between transition-transform transform hover:translate-y-[-5px] hover:shadow-lg">
                <div>
                  <div className="room-header flex justify-between items-center mb-4">
                    <h3 className="room-type text-xl font-semibold text-gray-800">{room.room_type}</h3>
                    <p
                      className={`room-status text-sm font-semibold px-3 py-1 rounded-full ${
                        room.is_available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {room.is_available ? "Available" : "Unavailable"}
                    </p>
                  </div>
                  <div className="room-body mb-4">
                    {renderAmenities(room.amenities)}
                  </div>
                </div>
                {room.is_available && (
                  <button
                    className="book-room-button mt-auto bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 px-4 rounded-md hover:from-blue-600 hover:to-blue-800 transition-colors duration-300"
                    onClick={() => goToBookingPage(room.room_id)}
                  >
                    Book Room
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-700">No rooms available for this hotel.</p>
        )}
      </div>

      {/* Reviews Section */}
      <div className="reviews-section bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-blue-700 mb-6">Reviews</h2>
        {reviews.length > 0 ? (
          <div className="reviews-container space-y-6 mb-6">
            {reviews.map((review, index) => (
              <div key={index} className="review-card border-l-4 border-blue-500 pl-4">
                <div className="review-header flex items-center mb-2">
                  {/* Optional: Reviewer Avatar */}
                  {/* 
                  {review.reviewer_avatar && (
                    <img src={review.reviewer_avatar} alt={`${review.reviewer_name} Avatar`} className="w-10 h-10 rounded-full mr-4" />
                  )}
                  */}
                  <div className="reviewer-info">
                    <p className="reviewer-name text-lg font-semibold text-gray-800">{review.reviewer_name}</p>
                    <div className="review-rating flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FontAwesomeIcon
                          key={i}
                          icon={faStar}
                          color={i < review.rating ? "#FFD700" : "#E0E0E0"}
                        />
                      ))}
                      <span className="rating-text text-sm text-gray-600">{review.rating}/5</span>
                    </div>
                  </div>
                </div>
                <p className="review-text italic text-gray-700">"{review.review_text}"</p>
                <div className="review-footer text-xs text-gray-500 mt-2">
                  {new Date(review.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-700 mb-6">No reviews available for this hotel.</p>
        )}

        {/* Add Review Section */}
        {renderReviewForm()}
      </div>

      {/* Styles */}
      <style jsx>{`
        .page-container {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .loader-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
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

        .add-review-section input {
          margin-top: 10px;
        }

        /* Responsive Enhancements */
        @media (max-width: 640px) {
          .hotel-info {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
