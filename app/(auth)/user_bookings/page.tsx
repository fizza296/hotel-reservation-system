"use client";

import { useEffect, useState } from "react";
import moment from "moment"; // Use moment.js for date manipulation (or day.js if preferred)

type Booking = {
  booking_id: number;
  hotel_name: string;
  room_type: string;
  check_in_date: string;
  check_out_date: string;
  status: string;
  special_requests: string | null;
  created_at: string; // Include created_at field
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
        // Update the booking status in the state instead of removing it
        setBookings((prev) =>
          prev.map((booking) =>
            booking.booking_id === bookingId
              ? { ...booking, status: "cancelled" } // Change status to 'cancelled'
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

  if (loading) return <div>Loading your bookings...</div>;

  if (message) return <div>{message}</div>;

  return (
    <div className="bookings-container">
      {bookings.map((booking) => {
        const isCancellable = moment().diff(moment(booking.created_at), "hours") <= 24;

        return (
          <div key={booking.booking_id} className="booking-card">
            <h3 className="hotel-name">{booking.hotel_name}</h3>
            <p>Room Type: {booking.room_type}</p>
            <p>Check-In: {booking.check_in_date}</p>
            <p>Check-Out: {booking.check_out_date}</p>
            <p>Created At: {moment(booking.created_at).format("MMMM Do YYYY, h:mm:ss a")}</p>
            <p>Status: {booking.status}</p>
            {booking.special_requests && <p>Special Requests: {booking.special_requests}</p>}
            {isCancellable && booking.status !== "cancelled" && (
              <button onClick={() => handleCancel(booking.booking_id)} className="cancel-button">
                Cancel Booking
              </button>
            )}
          </div>
        );
      })}

      <style jsx>{`
        .bookings-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 20px;
          background-color: #f5f5f5;
        }
        .booking-card {
          background: #fff;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }
        .booking-card:hover {
          transform: translateY(-5px);
        }
        .hotel-name {
          font-size: 1.5rem;
          font-weight: bold;
          color: #333;
          margin-bottom: 10px;
        }
        .cancel-button {
          background: #ff4d4d;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .cancel-button:hover {
          background: #e60000;
        }
      `}</style>
    </div>
  );
}





