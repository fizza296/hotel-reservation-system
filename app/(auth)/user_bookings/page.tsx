"use client";

import { useEffect, useState } from "react";
import moment from "moment";

type Booking = {
  booking_id: number;
  hotel_name: string;
  room_type: string;
  check_in_date: string;
  check_out_date: string;
  status: string;
  special_requests: string | null;
  created_at: string;
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);

      try {
        const res = await fetch(`/api/auth/user_bookings`, { credentials: "include" });
        const data = await res.json();

        if (res.status === 401) {
          setMessage(data.message);
        } else if (data.length === 0) {
          setMessage("No previous bookings found.");
        } else {
          setBookings(data);
        }
      } catch (error) {
        setMessage("Error fetching bookings.");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancel = async (bookingId: number) => {
    console.log("Cancel button clicked for booking ID:", bookingId);
    try {
      const res = await fetch(`/api/auth/cancel_booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ booking_id: bookingId }),
        credentials: "include",
      });

      if (res.ok) {
        setBookings((prev) =>
          prev.map((booking) =>
            booking.booking_id === bookingId
              ? { ...booking, status: "cancelled" }
              : booking
          )
        );
      } else {
        const errorData = await res.json();
        setMessage(errorData.message || "Failed to cancel booking");
      }
    } catch (error) {
      setMessage("Error cancelling booking");
      console.error("Error cancelling booking:", error);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-lg font-semibold text-gray-700">Loading your bookings...</div>
      </div>
    );

  if (message)
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-lg font-semibold text-gray-700">{message}</div>
      </div>
    );

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-800">My Bookings</h1>
      <div className="space-y-8">
        {bookings.map((booking, index) => {
          const isCancellable = moment().diff(moment(booking.created_at), "hours") <= 24;

          return (
            <div
              key={booking.booking_id}
              className={`rounded-lg p-6 shadow-lg transition-transform duration-300 hover:-translate-y-1 ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <div className="border-b pb-4 mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-blue-600">{booking.hotel_name}</h3>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      booking.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {booking.status === "cancelled" ? "Cancelled" : "Active"}
                  </span>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <p>
                  <span className="font-semibold text-gray-700">Room Type:</span> {booking.room_type}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">Check-In:</span>{" "}
                  {moment(booking.check_in_date).format("MMMM Do YYYY")}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">Check-Out:</span>{" "}
                  {moment(booking.check_out_date).format("MMMM Do YYYY")}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">Booked On:</span>{" "}
                  {moment(booking.created_at).format("MMMM Do YYYY, h:mm a")}
                </p>
                {booking.special_requests && (
                  <p className="sm:col-span-2">
                    <span className="font-semibold text-gray-700">Special Requests:</span>{" "}
                    {booking.special_requests}
                  </p>
                )}
              </div>
              {isCancellable && booking.status !== "cancelled" && (
                <div className="mt-6 text-right">
                  <button
                    onClick={() => handleCancel(booking.booking_id)}
                    className="rounded-md bg-red-600 px-4 py-2 text-white shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Cancel Booking
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
