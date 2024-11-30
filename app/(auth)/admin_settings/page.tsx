"use client";

import { useEffect, useState } from "react";

type Hotel = {
  hotel_id: number;
  name: string;
  description: string;
  image_link: string;
  rating: number;
};

type User = {
  user_id: number;
  username: string;
  email: string;
};

type Review = {
  review_id: number;
  hotel_id: number;
  user_id: number;
  rating: number;
  review_text: string;
};

export default function AdminPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newHotel, setNewHotel] = useState<Partial<Hotel>>({
    name: "",
    description: "",
    image_link: "",
    rating: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [hotelRes, userRes, reviewRes] = await Promise.all([
          fetch(`/api/auth/get_hotels`).then((res) => res.json()),
          fetch(`/api/auth/users`).then((res) => res.json()),
          fetch(`/api/auth/reviews`).then((res) => res.json()),
        ]);

        console.log("Hotel Response:", hotelRes);
        console.log("User Response:", userRes);
        console.log("Review Response:", reviewRes);

        // Ensure data is an array before updating the state
        if (Array.isArray(hotelRes)) setHotels(hotelRes);
        else console.error("Hotels data is not an array:", hotelRes);

        if (Array.isArray(userRes)) setUsers(userRes);
        else console.error("Users data is not an array:", userRes);

        if (Array.isArray(reviewRes)) setReviews(reviewRes);
        else console.error("Reviews data is not an array:", reviewRes);
      } catch (error) {
        setMessage("Error fetching data.");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewHotel((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Convert file to a preview URL or handle as needed
      const imageUrl = URL.createObjectURL(file);
      setNewHotel((prev) => ({ ...prev, image_link: imageUrl }));
    }
  };

  const handleAddHotel = async () => {
    try {
      const res = await fetch(`/api/auth/add_hotel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newHotel),
      });

      if (res.ok) {
        const addedHotel = await res.json();
        setHotels([...hotels, addedHotel]);
        setShowModal(false); // Close the modal
        setNewHotel({ name: "", description: "", image_link: "", rating: 0 }); // Reset form
      } else {
        const error = await res.json();
        console.error("Failed to add hotel:", error);
      }
    } catch (error) {
      console.error("Error adding hotel:", error);
    }
  };

  const handleDeleteHotel = async (hotelId: number) => {
    try {
      const res = await fetch(`/api/auth/delete_hotel`, {
        method: "DELETE",
        body: JSON.stringify({ hotel_id: hotelId }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setHotels(hotels.filter((hotel) => hotel.hotel_id !== hotelId));
      } else {
        setMessage("Failed to delete hotel.");
      }
    } catch (error) {
      setMessage("Error deleting hotel.");
      console.error("Error:", error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      const res = await fetch(`/api/auth/delete_user`, {
        method: "DELETE",
        body: JSON.stringify({ user_id: userId }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setUsers(users.filter((user) => user.user_id !== userId));
      } else {
        setMessage("Failed to delete user.");
      }
    } catch (error) {
      setMessage("Error deleting user.");
      console.error("Error:", error);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    try {
      const res = await fetch(`/api/auth/delete_review`, {
        method: "DELETE",
        body: JSON.stringify({ review_id: reviewId }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setReviews(reviews.filter((review) => review.review_id !== reviewId));
      } else {
        setMessage("Failed to delete review.");
      }
    } catch (error) {
      setMessage("Error deleting review.");
      console.error("Error:", error);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-lg font-semibold text-gray-700">Loading data...</div>
      </div>
    );

  if (message)
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-lg font-semibold text-gray-700">{message}</div>
      </div>
    );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-800">Admin Panel</h1>

      {/* Add Hotel Button */}
      <button
        onClick={() => setShowModal(true)}
        className="rounded-md bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700 mt-4"
      >
        Add Hotel
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Add New Hotel</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddHotel();
              }}
            >
              <label className="block mb-2">
                <span className="text-gray-700">Hotel Name</span>
                <input
                  type="text"
                  name="name"
                  value={newHotel.name || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </label>
              <label className="block mb-2">
                <span className="text-gray-700">Description</span>
                <textarea
                  name="description"
                  value={newHotel.description || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                ></textarea>
              </label>
              <label className="block mb-2">
                <span className="text-gray-700">Rating</span>
                <input
                  type="number"
                  name="rating"
                  value={newHotel.rating || ""}
                  onChange={handleInputChange}
                  min="0"
                  max="5"
                  step="0.1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </label>
              <label className="block mb-2">
                <span className="text-gray-700">Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mt-1 block w-full"
                />
                {newHotel.image_link && (
                  <img src={newHotel.image_link} alt="Preview" className="mt-2 h-32 w-auto rounded" />
                )}
              </label>
              <div className="mt-4 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-md bg-gray-300 px-4 py-2 shadow hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-green-600 px-4 py-2 text-white shadow hover:bg-green-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hotels Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Hotels</h2>
        <ul>
          {hotels.map((hotel) => (
            <li key={hotel.hotel_id} className="mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">{hotel.name}</h3>
                  <p>{hotel.description}</p>
                  {hotel.image_link && <img src={hotel.image_link} alt={hotel.name} className="mt-2 h-32 w-auto rounded" />}
                </div>
                <button
                  onClick={() => handleDeleteHotel(hotel.hotel_id)}
                  className="rounded-md bg-red-600 px-4 py-2 text-white shadow hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Users Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user.user_id} className="mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">{user.username}</h3>
                  <p>{user.email}</p>
                </div>
                <button
                  onClick={() => handleDeleteUser(user.user_id)}
                  className="rounded-md bg-red-600 px-4 py-2 text-white shadow hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Reviews Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
        <ul>
          {reviews.map((review) => (
            <li key={review.review_id} className="mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm">{review.review_text}</p>
                </div>
                <button
                  onClick={() => handleDeleteReview(review.review_id)}
                  className="rounded-md bg-red-600 px-4 py-2 text-white shadow hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
