"use client";

import { useEffect, useState } from "react";
import { parseCookies } from "nookies";

type Booking = {
  booking_id: number;
  hotel_name: string;
  room_type: string;
  check_in_date: string;
  check_out_date: string;
  status: string;
  special_requests: string | null;
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);

      try {
        const cookies = parseCookies();
        // const session = cookies.session || null;

        // if (!session) {
        //   setMessage('Please sign in to view your bookings.');
        //   return;
        // }

        const res = await fetch(`/api/auth/user_bookings`, { credentials: 'include' });
        const data = await res.json();

        if (res.status === 401) {
          setMessage(data.message);
        } else if (data.length === 0) {
          setMessage('No previous bookings found.');
        } else {
          setBookings(data);
        }
      } catch (error) {
        setMessage('Error fetching bookings.');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <div>Loading your bookings...</div>;

  if (message) return <div>{message}</div>;

  return (
    <div className="bookings-container">
      {bookings.map((booking) => (
        <div key={booking.booking_id} className="booking-card">
          <h3 className="hotel-name">{booking.hotel_name}</h3>
          <p>Room Type: {booking.room_type}</p>
          <p>Check-In: {booking.check_in_date}</p>
          <p>Check-Out: {booking.check_out_date}</p>
          <p>Status: {booking.status}</p>
          {booking.special_requests && <p>Special Requests: {booking.special_requests}</p>}
        </div>
      ))}

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
      `}</style>
    </div>
  );
}


