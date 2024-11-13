"use client";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { parseCookies } from 'nookies'; // Import nookies to parse cookies

export default function BookingsPage() {
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [hotelId, setHotelId] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [bookingMessage, setBookingMessage] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse cookies to get the user_id
  const cookies = parseCookies();
  const userId = cookies.user_id || null;

  useEffect(() => {
    const hotelId = searchParams.get('hotel_id');
    const roomId = searchParams.get('room_id');
    setHotelId(hotelId);
    setRoomId(roomId);

    // Log the userId to see if it's properly parsed
    console.log("Parsed User ID:", userId);
  }, [searchParams, cookies]);

  const handleBookRoom = async () => {
    if (!checkInDate || !checkOutDate || !hotelId || !roomId || !userId) {
      setBookingMessage('Please log in to book a room.' + ' userId: ' + userId);
      return;
    }

    try {
        const res = await fetch('/api/auth/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              hotel_id: hotelId,
              room_id: roomId,
              user_id: userId,
              check_in_date: checkInDate,
              check_out_date: checkOutDate,
              special_requests: specialRequests,
            }),
            credentials: 'include', 
      });

      const data = await res.json();
      if (res.ok) {
        setBookingMessage('Room booked successfully!');
        setTimeout(() => router.push(`/rooms?hotel_id=${hotelId}`), 2000);
      } else {
        setBookingMessage(data.message || 'Failed to book room.');
      }
    } catch (error) {
      setBookingMessage('Error booking room.');
      console.error('Error booking room:', error);
    }
  };

  return (
    <div className="booking-container">
      <h2>Book Your Stay</h2>
      <label>
        Check-in Date:
        <input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} />
      </label>
      <label>
        Check-out Date:
        <input type="date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} />
      </label>
      <label>
        Special Requests:
        <textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} />
      </label>
      <button onClick={handleBookRoom}>Confirm Booking</button>
      {bookingMessage && <p>{bookingMessage}</p>}

      <style jsx>{`
        .booking-container {
          max-width: 500px;
          margin: auto;
          padding: 20px;
          background-color: #f7f7f7;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .booking-container h2 {
          font-size: 1.5rem;
          color: #333;
          margin-bottom: 20px;
        }

        .booking-container label {
          display: block;
          margin-bottom: 10px;
          color: #555;
        }

        .booking-container input,
        .booking-container textarea {
          width: 100%;
          padding: 10px;
          margin-top: 5px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .booking-container button {
          margin-top: 20px;
          padding: 10px 15px;
          background-color: #0070f3;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .booking-container button:hover {
          background-color: #005bb5;
        }

        .booking-container p {
          margin-top: 15px;
          color: ${bookingMessage?.startsWith('Error') ? 'red' : 'green'};
        }
      `}</style>
    </div>
  );
}





  