"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Room = {
  room_id: number;
  room_type: string;
  is_available: boolean;
  amenities: string;
};

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [hotelId, setHotelId] = useState<string | null>(null);
  const router = useRouter();

  const fetchRooms = async () => {
    if (!hotelId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/rooms?hotel_id=${hotelId}`);
      const data = await res.json();
      setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('hotel_id');
    setHotelId(id);
  }, []);

  useEffect(() => {
    if (hotelId) {
      fetchRooms();
    }
  }, [hotelId]);

  const goToBookingPage = (roomId: number) => {
    router.push(`/bookings?hotel_id=${hotelId}&room_id=${roomId}`);
  };

  if (loading) {
    return <div>Loading rooms...</div>;
  }

  return (
    <div className="room-container">
      {rooms.map((room) => (
        <div key={room.room_id} className="room-card">
          <h3 className="room-type">Room Type: {room.room_type}</h3>
          <p className="room-amenities">Amenities: {room.amenities}</p>
          <p className={`room-status ${room.is_available ? 'available' : 'unavailable'}`}>
            Status: {room.is_available ? 'Available' : 'Unavailable'}
          </p>
          {room.is_available && (
            <button className="book-room-button" onClick={() => goToBookingPage(room.room_id)}>Book Room</button>
          )}
        </div>
      ))}
    <style jsx>{`
      .room-container {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        justify-content: center;
        padding: 20px;
        background-color: #f5f5f5;
      }
      .room-card {
        width: 280px;
        background: #fff;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
      }
      .room-card:hover {
        transform: translateY(-5px);
      }
      .room-type {
        font-size: 1.2rem;
        font-weight: bold;
        color: #333;
        margin-bottom: 10px;
      }
      .room-amenities {
        font-size: 1rem;
        color: #555;
        margin-bottom: 15px;
      }
      .room-status {
        font-size: 1rem;
        font-weight: bold;
        margin-bottom: 20px;
        color: #fff;
        padding: 5px 10px;
        border-radius: 5px;
        display: inline-block;
      }
      .available {
        background-color: #4caf50;
      }
      .unavailable {
        background-color: #f44336;
      }
      .book-room-button {
        padding: 10px 20px;
        background-color: #0070f3;
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }
      .book-room-button:hover {
        background-color: #005bb5;
      }
    `}</style>
  </div>
  );
}

      





