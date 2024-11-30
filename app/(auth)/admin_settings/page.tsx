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
  phone_number?: string;
  password?: string; // Added password field
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
  const [showHotelModal, setShowHotelModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false); // New state for user modal
  const [newHotel, setNewHotel] = useState<Partial<Hotel>>({
    name: "",
    description: "",
    image_link: "",
    rating: 0,
  });
  const [newUser, setNewUser] = useState<Partial<User>>({
    username: "",
    email: "",
    phone_number: "",
    password: "", // Ensure password is included
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

        if (Array.isArray(hotelRes)) setHotels(hotelRes);
        if (Array.isArray(userRes)) setUsers(userRes);
        if (Array.isArray(reviewRes)) setReviews(reviewRes);
      } catch (error) {
        setMessage("Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleHotelInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewHotel((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
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
        setShowHotelModal(false); // Close the modal
        setNewHotel({ name: "", description: "", image_link: "", rating: 0 }); // Reset form
      } else {
        setMessage("Failed to add hotel.");
      }
    } catch (error) {
      setMessage("Error adding hotel.");
    }
  };

  const handleAddUser = async () => {
    try {
      const res = await fetch(`/api/auth/add_user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (res.ok) {
        const addedUser = await res.json();
        setUsers([...users, addedUser]);
        setShowUserModal(false); // Close the modal
        setNewUser({ username: "", email: "", phone_number: "", password: "" }); // Reset form
      } else {
        setMessage("Failed to add user.");
      }
    } catch (error) {
      setMessage("Error adding user.");
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
        onClick={() => setShowHotelModal(true)}
        className="rounded-md bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700 mt-4"
      >
        Add Hotel
      </button>

      {/* Add User Button */}
      <button
        onClick={() => setShowUserModal(true)}
        className="rounded-md bg-green-600 px-4 py-2 text-white shadow hover:bg-green-700 mt-4"
      >
        Add User
      </button>

      {/* Modal for Add User */}
      {showUserModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Add New User</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddUser();
              }}
            >
              <label className="block mb-2">
                <span className="text-gray-700">Username</span>
                <input
                  type="text"
                  name="username"
                  value={newUser.username || ""}
                  onChange={handleUserInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </label>
              <label className="block mb-2">
                <span className="text-gray-700">Email</span>
                <input
                  type="email"
                  name="email"
                  value={newUser.email || ""}
                  onChange={handleUserInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </label>
              <label className="block mb-2">
                <span className="text-gray-700">Phone Number</span>
                <input
                  type="text"
                  name="phone_number"
                  value={newUser.phone_number || ""}
                  onChange={handleUserInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </label>
              <label className="block mb-2">
                <span className="text-gray-700">Password</span>
                <input
                  type="password"
                  name="password"
                  value={newUser.password || ""}
                  onChange={handleUserInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </label>

              <div className="mt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-green-600 px-4 py-2 text-white shadow hover:bg-green-700"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List of Hotels */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800">Hotels</h2>
        <ul className="space-y-4">
          {hotels.map((hotel) => (
            <li key={hotel.hotel_id} className="border p-4 rounded-lg">
              <h3 className="text-lg font-semibold">{hotel.name}</h3>
              <p>{hotel.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Rating: {hotel.rating}</span>
                <button
                  onClick={() => handleDeleteHotel(hotel.hotel_id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* List of Users */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800">Users</h2>
        <ul className="space-y-4">
          {users.map((user) => (
            <li key={user.user_id} className="border p-4 rounded-lg">
              <h3 className="text-lg font-semibold">{user.username}</h3>
              <p>{user.email}</p>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => handleDeleteUser(user.user_id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* List of Reviews */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800">Reviews</h2>
        <ul className="space-y-4">
          {reviews.map((review) => (
            <li key={review.review_id} className="border p-4 rounded-lg">
              <h3 className="text-lg font-semibold">
                Hotel ID: {review.hotel_id} - User ID: {review.user_id}
              </h3>
              <p>Rating: {review.rating}</p>
              <p>{review.review_text}</p>
              <button
                onClick={() => handleDeleteReview(review.review_id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


