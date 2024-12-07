"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Booking {
  id: number;
  user_id: number;
  room_id: number;
  booking_date: string;
  check_in: string;
  check_out: string;
}

export default function UpdateBookingPage() {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("booking_id");

  // Helper function to format ISO date to YYYY-MM-DD
  const formatDate = (isoDate: string | null | undefined) => {
    if (!isoDate) return ""; // Return an empty string for invalid dates
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return ""; // Return an empty string for invalid Date objects
    return date.toISOString().split("T")[0]; // Extract the date part
  };

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await fetch(`/api/auth/get_booking?booking_id=${bookingId}`, {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setBooking(data);
        } else {
          const data = await res.json();
          setError(data.message || "Booking not found or an error occurred.");
        }
      } catch (err) {
        setError("An error occurred while fetching the booking.");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBooking();
    } else {
      setError("No booking ID provided.");
      setLoading(false);
    }
  }, [bookingId]);

  const handleUpdate = async (updatedBooking: Booking) => {
    setError(null);
    setSuccessMessage(null);
    try {
      const res = await fetch(`/api/auth/update_booking?booking_id=${bookingId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBooking),
        credentials: "include",
      });

      if (res.ok) {
        setSuccessMessage("Booking updated successfully!");
        // Optionally, redirect after a short delay
        setTimeout(() => {
          router.push("/user_bookings");
        }, 2000);
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to update booking.");
      }
    } catch (err) {
      setError("An error occurred while updating the booking.");
      console.error("Error:", err);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-lg font-semibold text-gray-700">Loading booking details...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-lg font-semibold text-red-500">{error}</div>
      </div>
    );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Update Booking</h1>
        <p className="mb-4 text-center text-gray-600">Booking ID: {bookingId}</p>

        {successMessage && (
          <div className="mb-4 text-green-600 text-center">{successMessage}</div>
        )}

        {booking && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const updatedBooking = {
                ...booking,
                check_in: (e.target as any).check_in.value,
                check_out: (e.target as any).check_out.value,
              };
              handleUpdate(updatedBooking as Booking);
            }}
          >
            <div className="mb-4">
              <label htmlFor="check_in" className="block text-gray-700 font-medium mb-2">
                Check-in Date:
              </label>
              <input
                type="date"
                id="check_in"
                name="check_in"
                defaultValue={formatDate(booking.check_in)}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="check_out" className="block text-gray-700 font-medium mb-2">
                Check-out Date:
              </label>
              <input
                type="date"
                id="check_out"
                name="check_out"
                defaultValue={formatDate(booking.check_out)}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Update Booking
              </button>
            </div>
          </form>
        )}

        <button
          onClick={() => router.back()}
          className="mt-6 w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Back
        </button>
      </div>
    </div>
  );
}
