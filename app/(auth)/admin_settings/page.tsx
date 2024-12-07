  // app/auth/admin_settings/page.tsx

  "use client";

  import { useEffect, useState, ChangeEvent, FormEvent } from "react";
  import Toast from "../../../components/toast";

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
    password?: string;
  };

  type Review = {
    review_id: number;
    hotel_id: number;
    user_id: number;
    rating: number;
    review_text: string;
    created_at: string; // Assuming you have a created_at field
  };

  export default function AdminPage() {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [showHotelModal, setShowHotelModal] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);
    const [showReviewsModal, setShowReviewsModal] = useState(false); // New state for reviews modal
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
      password: "",
    });
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    // New states for handling selected hotel and its reviews
    const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
    const [hotelReviews, setHotelReviews] = useState<Review[]>([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);

    // Toast state
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    // Helper functions to show toasts
    const showError = (msg: string) => {
      console.error(msg); // Log to console for debugging
      setToast({ message: msg, type: "error" });
    };

    const showSuccess = (msg: string) => {
      console.log(msg); // Log to console for debugging
      setToast({ message: msg, type: "success" });
    };

    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [hotelRes, userRes] = await Promise.all([
            fetch(`/api/auth/get_hotels`).then((res) => res.json()),
            fetch(`/api/auth/users`).then((res) => res.json()),
          ]);

          if (Array.isArray(hotelRes)) {
            // Sanitize hotel descriptions
            const sanitizedHotels = hotelRes.map((hotel: Hotel) => ({
              ...hotel,
              description: hotel.description || "", // Ensure description is a string
            }));
            setHotels(sanitizedHotels);
          }
          if (Array.isArray(userRes)) setUsers(userRes);
        } catch (error) {
          showError("Error fetching data.");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, []);

    // Function to fetch reviews for a specific hotel
    const fetchReviews = async (hotelId: number) => {
      setReviewsLoading(true);
      try {
        const res = await fetch(`/api/auth/reviews?hotel_id=${hotelId}`);
        if (res.ok) {
          const data: Review[] = await res.json();
          setHotelReviews(data);
        } else {
          const errorText = await res.text();
          console.error("Fetch Reviews Error:", errorText);
          showError("Failed to fetch reviews.");
        }
      } catch (error) {
        console.error("Fetch Reviews Exception:", error);
        showError("Error fetching reviews.");
      } finally {
        setReviewsLoading(false);
      }
    };

    const handleHotelInputChange = (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target;
      setNewHotel((prev) => ({ ...prev, [name]: value }));
    };

    const handleUserInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setNewUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setSelectedImage(file);
    
        // Automatically trigger the upload
        const fileName = `${Date.now()}-${encodeURIComponent(file.name)}`;
        const region = "us-east-1"; // Update to your bucket's region
        const s3BucketUrl = `https://my-hotel-images-public.s3.${region}.amazonaws.com/${fileName}`;
    
        try {
          setUploading(true);
          const res = await fetch(s3BucketUrl, {
            method: "PUT",
            headers: {
              "Content-Type": file.type,
            },
            body: file,
          });
    
          if (res.ok) {
            setNewHotel((prev) => ({ ...prev, image_link: s3BucketUrl }));
            showSuccess("Image uploaded successfully.");
            console.log("Image uploaded to:", s3BucketUrl);
          } else {
            const errorText = await res.text();
            console.error("Upload Error:", errorText);
            showError(`Failed to upload image: ${errorText}`);
          }
        } catch (error) {
          console.error("Upload Exception:", error);
          showError("Error uploading image.");
        } finally {
          setUploading(false);
        }
      }
    };
    



    const handleAddHotel = async (e: FormEvent) => {
      e.preventDefault();
      console.log("Submitting Add Hotel Form:", newHotel);

      // Ensure image is uploaded
      if (!newHotel.image_link) {
        showError("Please upload an image before submitting.");
        return;
      }

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
          setSelectedImage(null);
          showSuccess("Hotel added successfully.");
          console.log("Added Hotel:", addedHotel);
        } else {
          const errorText = await res.text();
          console.error("Add Hotel Error:", errorText);
          showError("Failed to add hotel.");
        }
      } catch (error) {
        console.error("Add Hotel Exception:", error);
        showError("Error adding hotel.");
      }
    };
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

    const handleAddUser = async (e: FormEvent) => {
      e.preventDefault();
      console.log("Submitting Add User Form:", newUser);
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
          setNewUser({
            username: "",
            email: "",
            phone_number: "",
            password: "",
          }); // Reset form
          showSuccess("User added successfully.");
          console.log("Added User:", addedUser);
        } else {
          const errorText = await res.text();
          console.error("Add User Error:", errorText);
          showError("Failed to add user.");
        }
      } catch (error) {
        console.error("Add User Exception:", error);
        showError("Error adding user.");
      }
    };

    const handleDeleteHotel = async (hotelId: number) => {
      console.log("Deleting Hotel ID:", hotelId);
      try {
        const res = await fetch(`/api/auth/delete_hotel`, {
          method: "DELETE",
          body: JSON.stringify({ hotel_id: hotelId }),
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          setHotels(hotels.filter((hotel) => hotel.hotel_id !== hotelId));
          // If the deleted hotel is selected, clear the selection
          if (selectedHotel && selectedHotel.hotel_id === hotelId) {
            setSelectedHotel(null);
            setHotelReviews([]);
          }
          showSuccess("Hotel deleted successfully.");
          console.log("Deleted Hotel ID:", hotelId);
        } else {
          const errorText = await res.text();
          console.error("Delete Hotel Error:", errorText);
          showError("Failed to delete hotel.");
        }
      } catch (error) {
        console.error("Delete Hotel Exception:", error);
        showError("Error deleting hotel.");
      }
    };

    const handleDeleteUser = async (userId: number) => {
      console.log("Deleting User ID:", userId);
      try {
        const res = await fetch(`/api/auth/delete_user`, {
          method: "DELETE",
          body: JSON.stringify({ user_id: userId }),
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          setUsers(users.filter((user) => user.user_id !== userId));
          showSuccess("User deleted successfully.");
          console.log("Deleted User ID:", userId);
        } else {
          const errorText = await res.text();
          console.error("Delete User Error:", errorText);
          showError("Failed to delete user.");
        }
      } catch (error) {
        console.error("Delete User Exception:", error);
        showError("Error deleting user.");
      }
    };

    const handleDeleteReview = async (reviewId: number) => {
      // Optional: Add a confirmation prompt to prevent accidental deletions
      if (!confirm('Are you sure you want to delete this review?')) return;
    
      console.log("Deleting Review ID:", reviewId);
      try {
        // Send DELETE request with review_id as a query parameter
        const res = await fetch(`/api/auth/delete_review?review_id=${reviewId}`, {
          method: "DELETE",
        });
    
        if (res.ok) {
          // Remove the deleted review from the state
          setHotelReviews(hotelReviews.filter((review) => review.review_id !== reviewId));
          showSuccess("Review deleted successfully.");
          console.log("Deleted Review ID:", reviewId);
        } else {
          // Parse the error response
          const errorData = await res.json();
          console.error("Delete Review Error:", errorData.message);
          showError(`Failed to delete review: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Delete Review Exception:", error);
        showError("Error deleting review.");
      }
    };

    // Handler for clicking on a hotel to show reviews in modal
    const handleHotelClick = (hotel: Hotel) => {
      setSelectedHotel(hotel);
      setShowReviewsModal(true);
      fetchReviews(hotel.hotel_id);
    };

    // Handler to close the reviews modal
    const closeReviewsModal = () => {
      setShowReviewsModal(false);
      setSelectedHotel(null);
      setHotelReviews([]);
    };

    if (loading)
      return (
        <div className="flex items-center justify-center py-20">
          <div className="text-lg font-semibold text-gray-700">Loading data...</div>
        </div>
      );

    return (
      <div className="mx-auto max-w-8xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-4xl font-bold text-gray-800 text-center">Admin Panel</h1>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mb-6">
          <button
            onClick={() => setShowHotelModal(true)}
            className="rounded-md bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700 transition"
          >
            Add Hotel
          </button>

          <button
            onClick={() => setShowUserModal(true)}
            className="rounded-md bg-green-600 px-4 py-2 text-white shadow hover:bg-green-700 transition"
          >
            Add User
          </button>
        </div>

        {/* Toast Notification */}
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}

        {/* Modal for Add Hotel */}
        {showHotelModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Add New Hotel</h2>
              <form onSubmit={handleAddHotel}>
                <label className="block mb-3">
                  <span className="text-gray-700">Name</span>
                  <input
                    type="text"
                    name="name"
                    value={newHotel.name || ""}
                    onChange={handleHotelInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </label>
                <label className="block mb-3">
                  <span className="text-gray-700">Description</span>
                  <textarea
                    name="description"
                    value={newHotel.description || ""}
                    onChange={handleHotelInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </label>

                {/* Image Upload Section */}
                <div className="mb-3">
                  <span className="text-gray-700">Image</span>
                  <div className="flex items-center mt-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                  
                  </div>
                  {newHotel.image_link && (
                    <div className="mt-2">
                      <span className="text-green-600 text-sm">Image uploaded successfully.</span>
                    </div>
                  )}
                </div>

                <label className="block mb-3">
                  <span className="text-gray-700">Rating</span>
                  <input
                    type="number"
                    name="rating"
                    value={newHotel.rating || 0}
                    onChange={handleHotelInputChange}
                    min="0"
                    max="5"
                    step="0.1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </label>

                <div className="mt-4 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowHotelModal(false)}
                    className="text-gray-500 hover:text-gray-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700 transition"
                  >
                    Add Hotel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal for Add User */}
        {showUserModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Add New User</h2>
              <form onSubmit={handleAddUser}>
                <label className="block mb-3">
                  <span className="text-gray-700">Username</span>
                  <input
                    type="text"
                    name="username"
                    value={newUser.username || ""}
                    onChange={handleUserInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </label>
                <label className="block mb-3">
                  <span className="text-gray-700">Email</span>
                  <input
                    type="email"
                    name="email"
                    value={newUser.email || ""}
                    onChange={handleUserInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </label>
                <label className="block mb-3">
                  <span className="text-gray-700">Phone Number</span>
                  <input
                    type="text"
                    name="phone_number"
                    value={newUser.phone_number || ""}
                    onChange={handleUserInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </label>
                <label className="block mb-3">
                  <span className="text-gray-700">Password</span>
                  <input
                    type="password"
                    name="password"
                    value={newUser.password || ""}
                    onChange={handleUserInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </label>

                <div className="mt-4 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowUserModal(false)}
                    className="text-gray-500 hover:text-gray-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-green-600 px-4 py-2 text-white shadow hover:bg-green-700 transition"
                  >
                    Add User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal for Reviews */}
        {showReviewsModal && selectedHotel && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full overflow-y-auto max-h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Reviews for "{selectedHotel.name}"</h2>
                <button
                  onClick={closeReviewsModal}
                  className="text-gray-500 hover:text-gray-700 transition"
                >
                  ✖️
                </button>
              </div>
              {reviewsLoading ? (
                <div className="text-center text-gray-700">Loading reviews...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">User ID</th>
                        <th className="py-2 px-4 border-b">Rating</th>
                        <th className="py-2 px-4 border-b">Review Text</th>
                        <th className="py-2 px-4 border-b">Created At</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hotelReviews.map((review) => (
                        <tr key={review.review_id} className="hover:bg-gray-100">
                          <td className="py-2 px-4 border-b text-center">{review.review_id}</td>
                          <td className="py-2 px-4 border-b text-center">{review.user_id}</td>
                          <td className="py-2 px-4 border-b text-center">{review.rating}</td>
                          <td className="py-2 px-4 border-b">
                            {review.review_text.length > 100
                              ? `${review.review_text.substring(0, 100)}...`
                              : review.review_text}
                          </td>
                          <td className="py-2 px-4 border-b text-center">
                            {new Date(review.created_at).toLocaleString()}
                          </td>
                          <td className="py-2 px-4 border-b text-center">
                            <button
                              onClick={() => handleDeleteReview(review.review_id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                      {hotelReviews.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-4">
                            No reviews available for this hotel.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 gap-8">
          {/* List of Hotels */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Hotels</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">ID</th>
                    <th className="py-2 px-4 border-b">Name</th>
                    <th className="py-2 px-4 border-b">Description</th>
                    <th className="py-2 px-4 border-b">Rating</th>
                    <th className="py-2 px-4 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {hotels.map((hotel) => (
                    <tr key={hotel.hotel_id} className="hover:bg-gray-100">
                      <td className="py-2 px-4 border-b text-center">{hotel.hotel_id}</td>
                      <td
                        className="py-2 px-4 border-b cursor-pointer text-blue-600 hover:underline"
                        onClick={() => handleHotelClick(hotel)} // Updated click handler
                      >
                        {hotel.name}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {hotel.description.length > 100
                          ? `${hotel.description.substring(0, 100)}...`
                          : hotel.description || "No description provided."}
                      </td>
                      <td className="py-2 px-4 border-b text-center">{hotel.rating}</td>
                      <td className="py-2 px-4 border-b text-center">
                        <button
                          onClick={() => handleDeleteHotel(hotel.hotel_id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {hotels.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        No hotels available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* List of Users */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Users</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">ID</th>
                    <th className="py-2 px-4 border-b">Username</th>
                    <th className="py-2 px-4 border-b">Email</th>
                    <th className="py-2 px-4 border-b">Phone Number</th>
                    <th className="py-2 px-4 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.user_id} className="hover:bg-gray-100">
                      <td className="py-2 px-4 border-b text-center">{user.user_id}</td>
                      <td className="py-2 px-4 border-b">{user.username}</td>
                      <td className="py-2 px-4 border-b">{user.email}</td>
                      <td className="py-2 px-4 border-b">
                        {user.phone_number || "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        <button
                          onClick={() => handleDeleteUser(user.user_id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        No users available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    );
  }
