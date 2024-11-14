"use client";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { parseCookies } from 'nookies';
import { jsPDF } from 'jspdf'; // Import jsPDF

export default function BookingsPage() {
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [hotelId, setHotelId] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [bookingMessage, setBookingMessage] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<any>(null); // State for receipt data
  const router = useRouter();
  const searchParams = useSearchParams();

  const cookies = parseCookies();
  const userId = cookies.user_id || null;

  useEffect(() => {
    const hotelId = searchParams.get('hotel_id');
    const roomId = searchParams.get('room_id');
    setHotelId(hotelId);
    setRoomId(roomId);

    console.log("Parsed User ID:", userId);
  }, [searchParams, cookies]);

  const handleBookRoom = async () => {
    if (!checkInDate || !checkOutDate || !hotelId || !roomId || !userId) {
      setBookingMessage('Please log in to book a room.');
      return;
    }

    try {
      // Step 1: Book the room
      const bookingRes = await fetch('/api/auth/bookings', {
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

      const bookingData = await bookingRes.json();
      if (!bookingRes.ok) {
        setBookingMessage(bookingData.message || 'Failed to book room.');
        return;
      }

      setBookingMessage('Room booked successfully!');

      // Step 2: Create the receipt
      const receiptRes = await fetch('/api/auth/receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: bookingData.booking_id,
          user_id: userId,
        }),
      });

      const receiptData = await receiptRes.json();
      if (receiptRes.ok) {
        setReceipt(receiptData); // Save the receipt data to display
      } else {
        setBookingMessage(receiptData.message || 'Failed to create receipt.');
      }
    } catch (error) {
      setBookingMessage('Error booking room or creating receipt.');
      console.error('Error:', error);
    }
  };

  // Function to download receipt as PDF using jsPDF
  const handleDownloadReceipt = () => {
    if (!receipt) {
      setBookingMessage('No receipt available to download.');
      return;
    }

    const { receipt_id, booking_id, user_id, receipt_date } = receipt;

    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Add title and styling
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Hotel Booking Receipt', 105, 20, { align: 'center' });

    // Add receipt details
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Receipt ID: ${receipt_id}`, 20, 40);
    doc.text(`Booking ID: ${booking_id}`, 20, 50);
    doc.text(`User ID: ${user_id}`, 20, 60);
    doc.text(`Receipt Date: ${new Date(receipt_date).toLocaleString()}`, 20, 70);

    // Add some extra details if needed
    doc.text('Special Requests: ' + (receipt.special_requests || 'None'), 20, 80);

    // Add a footer
    doc.setFontSize(10);
    doc.text('Thank you for booking with us!', 105, 280, { align: 'center' });

    // Save the PDF
    doc.save(`receipt_${receipt_id}.pdf`);
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

      {/* Popup for Receipt */}
      {receipt && (
        <div className="receipt-popup">
          <h3>Receipt Details</h3>
          <p>Receipt ID: {receipt.receipt_id}</p>
          <p>Booking ID: {receipt.booking_id}</p>
          <p>User ID: {receipt.user_id}</p>
          <p>Receipt Date: {new Date(receipt.receipt_date).toLocaleString()}</p>
          <button onClick={handleDownloadReceipt}>Download PDF</button>
        </div>
      )}

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
        .receipt-popup {
          margin-top: 20px;
          padding: 20px;
          background-color: #e8f0fe;
          border: 1px solid #bcd4ff;
          border-radius: 8px;
        }
        .receipt-popup h3 {
          margin-bottom: 10px;
          color: #333;
        }
        .receipt-popup button {
          margin-top: 10px;
          padding: 8px 12px;
          background-color: #0070f3;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .receipt-popup button:hover {
          background-color: #005bb5;
        }
      `}</style>
    </div>
  );
}
