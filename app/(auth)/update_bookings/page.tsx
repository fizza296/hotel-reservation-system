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
          setError("Booking not found or an error occurred.");
        }
      } catch (err) {
        setError("An error occurred while fetching the booking.");
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
    try {
      const res = await fetch(`/api/auth/update_booking?booking_id=${bookingId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBooking),
        credentials: "include",
      });

      if (res.ok) {
        router.push("/user_bookings"); // Redirect to My Bookings page
      } else {
        setError("Failed to update booking.");
      }
    } catch (err) {
      setError("An error occurred while updating the booking.");
    }
  };

  if (loading) return <div>Loading booking details...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Update Booking</h1>
      <p>Booking ID: {bookingId}</p>
      {booking && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const updatedBooking = {
              ...booking,
              check_in: (e.target as any).check_in.value,
              check_out: (e.target as any).check_out.value
            };
            handleUpdate(updatedBooking as Booking);
          }}
        >
          <label>
            Check-in Date:
            <input
              type="date"
              name="check_in"
              defaultValue={formatDate(booking.check_in)} // Safely format ISO date
            />
          </label>
          <br />
          <label>
            Check-out Date:
            <input
              type="date"
              name="check_out"
              defaultValue={formatDate(booking.check_out)} // Safely format ISO date
            />
          </label>
          <br />
          <br />
          <button type="submit">Update Booking</button>
        </form>
      )}
      <button onClick={() => router.back()}>Back</button>
    </div>
  );
}
