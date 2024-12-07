"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { parseCookies } from "nookies";
import { jsPDF } from "jspdf"; // Import jsPDF

export default function BookingsPage() {
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [hotelId, setHotelId] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [bookingMessage, setBookingMessage] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<any>(null); // State for receipt data
  const [isPopupVisible, setIsPopupVisible] = useState(false); // State for popup visibility
  const router = useRouter();
  const searchParams = useSearchParams();

  const cookies = parseCookies();
  const userId = cookies.user_id || null;

  useEffect(() => {
    const hotelIdParam = searchParams.get("hotel_id");
    const roomIdParam = searchParams.get("room_id");
    setHotelId(hotelIdParam);
    setRoomId(roomIdParam);
  }, [searchParams, cookies]);

  const handleBookRoom = async () => {
    if (!checkInDate || !checkOutDate || !hotelId || !roomId || !userId) {
      setBookingMessage("Please log in to book a room.");
      return;
    }

    try {
      // Step 1: Book the room
      const bookingRes = await fetch("/api/auth/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotel_id: hotelId,
          room_id: roomId,
          user_id: userId,
          check_in_date: checkInDate,
          check_out_date: checkOutDate,
          special_requests: specialRequests,
        }),
        credentials: "include",
      });

      const bookingData = await bookingRes.json();
      if (!bookingRes.ok) {
        setBookingMessage(bookingData.message || "Failed to book room.");
        return;
      }

      setBookingMessage("Room booked successfully!");

      // Step 2: Create the receipt
      const receiptRes = await fetch("/api/auth/receipts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_id: bookingData.booking_id,
        }),
      });

      const receiptData = await receiptRes.json();
      if (receiptRes.ok) {
        setReceipt(receiptData); // Save the receipt data to display
      } else {
        setBookingMessage(receiptData.message || "Failed to create receipt.");
      }
    } catch (error) {
      setBookingMessage("Error booking room or creating receipt.");
    }
  };

  // Function to download receipt as PDF using jsPDF
  const handleDownloadReceipt = () => {
    if (!receipt) {
      setBookingMessage("No receipt available to download.");
      return;
    }

    const {
      receipt_id,
      booking_id,
      user_id,
      receipt_date,
      username,
      hotel_name,
      room_type,
      check_in_date,
      check_out_date,
      special_requests,
    } = receipt;

    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();

    // Add Header Background
    doc.setFillColor(230, 230, 250); // Lavender
    doc.rect(0, 0, pageWidth, 50, "F");

    // Title
    doc.setFont("helvetica", "bolditalic");
    doc.setTextColor(25, 25, 112); // Midnight Blue
    doc.setFontSize(24);
    doc.text("Hotel Booking Receipt", pageWidth / 2, 30, { align: "center" });

    // Subtitle
    doc.setFont("helvetica", "italic");
    doc.setTextColor(0, 0, 0); // Black
    doc.setFontSize(16);
    doc.text(`Receipt ID: ${receipt_id}`, pageWidth / 2, 40, { align: "center" });

    // Details Section
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0); // Black
    doc.setFontSize(12);

    const details = [
      { label: "Booking ID", value: booking_id },
      { label: "User ID", value: user_id },
      { label: "Username", value: username },
      { label: "Hotel Name", value: hotel_name },
      { label: "Room Type", value: room_type },
      { label: "Check-in Date", value: new Date(check_in_date).toLocaleDateString() },
      { label: "Check-out Date", value: new Date(check_out_date).toLocaleDateString() },
      { label: "Special Requests", value: special_requests || "None" },
      { label: "Receipt Date", value: new Date(receipt_date).toLocaleString() },
    ];

    let currentY = 60;
    details.forEach((detail) => {
      doc.setFont("helvetica", "bolditalic");
      doc.text(`${detail.label}:`, pageWidth / 2 - 30, currentY, { align: "right" });
      doc.setFont("helvetica", "normal");
      doc.text(detail.value.toString(), pageWidth / 2 + 10, currentY, { align: "left" });
      currentY += 10;
    });

    // Horizontal Line
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 128); // Navy blue
    doc.line(20, currentY, pageWidth - 20, currentY);
    currentY += 10;

    // Additional Information
    doc.setFont("helvetica", "italic");
    doc.setTextColor(0, 0, 0);
    doc.text("Thank you for choosing our hotel!", pageWidth / 2, currentY + 20, {
      align: "center",
    });

    // Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(105, 105, 105); // Dim Grey
    doc.text(
      "For any inquiries, contact us at support@hotel.com",
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 20,
      { align: "center" }
    );

    // Save the PDF
    doc.save(`receipt_${receipt_id}.pdf`);
  };

  // Function to open the receipt popup
  const openPopup = () => {
    setIsPopupVisible(true);
  };

  // Function to close the receipt popup and redirect to hotels page
  const handleClosePopup = () => {
    setIsPopupVisible(false);
    router.push("/hotels"); // Adjust the path if your hotels page route is different
  };

  return (
    <div className="booking-container">
      <h2>Book Your Stay</h2>
      <label>
        Check-in Date:
        <input
          type="date"
          value={checkInDate}
          onChange={(e) => setCheckInDate(e.target.value)}
          aria-label="Check-in Date"
        />
      </label>
      <label>
        Check-out Date:
        <input
          type="date"
          value={checkOutDate}
          onChange={(e) => setCheckOutDate(e.target.value)}
          aria-label="Check-out Date"
        />
      </label>
      <label>
        Special Requests:
        <textarea
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          aria-label="Special Requests"
        />
      </label>
      <button onClick={handleBookRoom} aria-label="Confirm Booking">
        Confirm Booking
      </button>
      {bookingMessage && (
        <p
          className={
            bookingMessage.startsWith("Room booked") ? "success" : "error"
          }
        >
          {bookingMessage}
        </p>
      )}
      {bookingMessage && bookingMessage.startsWith("Room booked") && (
        <button className="download-button" onClick={openPopup} aria-label="Download Receipt">
          Download Receipt
        </button>
      )}

      {/* Overlay */}
      {isPopupVisible && <div className="overlay"></div>}

      {/* Popup for Receipt */}
      {isPopupVisible && receipt && (
        <div className="receipt-popup" role="dialog" aria-modal="true" aria-labelledby="receipt-title">
          {/* Close Button */}
          <button
            className="close-button"
            onClick={handleClosePopup}
            aria-label="Close Receipt Popup"
          >
            &times;
          </button>
          {/* Center-aligned Heading */}
          <h2 className="popup-heading">Receipt</h2>

          {/* Receipt Details */}
          <div className="receipt-details">
            <p><strong>Receipt ID:</strong> {receipt.receipt_id}</p>
            <p><strong>Booking ID:</strong> {receipt.booking_id}</p>
            <p><strong>User ID:</strong> {receipt.user_id}</p>
            <p><strong>Username:</strong> {receipt.username}</p>
            <p><strong>Hotel Name:</strong> {receipt.hotel_name}</p>
            <p><strong>Room Type:</strong> {receipt.room_type}</p>
            <p><strong>Check-in Date:</strong> {new Date(receipt.check_in_date).toLocaleDateString()}</p>
            <p><strong>Check-out Date:</strong> {new Date(receipt.check_out_date).toLocaleDateString()}</p>
            <p><strong>Special Requests:</strong> {receipt.special_requests || "None"}</p>
            <p><strong>Receipt Date:</strong> {new Date(receipt.receipt_date).toLocaleString()}</p>
          </div>

          {/* Download PDF Button */}
          <button onClick={handleDownloadReceipt} aria-label="Download PDF">
            Download PDF
          </button>
        </div>
      )}

      <style jsx>{`
        .booking-container {
          max-width: 500px;
          margin: 50px auto;
          padding: 20px;
          background-color: #f7f7f7;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          font-family: 'Helvetica', sans-serif;
        }
        .booking-container h2 {
          font-size: 1.8rem;
          color: #333;
          text-align: center;
          margin-bottom: 20px;
        }
        .booking-container label {
          display: block;
          margin-bottom: 15px;
          color: #555;
        }
        .booking-container input,
        .booking-container textarea {
          width: 100%;
          padding: 10px;
          margin-top: 5px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }
        .booking-container textarea {
          resize: vertical;
          height: 80px;
        }
        .booking-container button {
          margin-top: 10px;
          padding: 12px 20px;
          background-color: #0070f3;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.3s ease;
        }
        .booking-container button:hover {
          background-color: #005bb5;
        }
        .download-button {
          margin-top: 10px;
          padding: 12px 20px;
          background-color: #28a745;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.3s ease;
        }
        .download-button:hover {
          background-color: #218838;
        }
        .booking-container p.success {
          margin-top: 15px;
          color: green;
          font-weight: bold;
          text-align: center;
        }
        .booking-container p.error {
          margin-top: 15px;
          color: red;
          font-weight: bold;
          text-align: center;
        }
        .download-button {
          display: block;
          margin-left: auto;
          margin-right: auto;
        }
          .receipt-popup {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90%;
          max-width: 500px;
          padding: 30px 40px;
          background-color: #ffffff;
          border: 2px solid #0070f3;
          border-radius: 10px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
          z-index: 1000;
          text-align: center;
        }
        .close-button {
          position: absolute;
          top: 10px;
          right: 10px;
          background: transparent;
          border: none;
          font-size: 24px;
          font-weight: bold;
          cursor: pointer;
          color: red;
        }
        .popup-heading {
          font-size: 1.8rem;
          color: #0070f3;
          margin-bottom: 20px;
        }
        
        /* Close Button Styles */
        .close-button {
          position: absolute;
          top: 15px;
          right: 20px;
          background: transparent;
          border: none;
          font-size: 28px;
          font-weight: bold;
          cursor: pointer;
          color: red; /* Red color for the close button */
          transition: color 0.3s ease;
        }
        .close-button:hover {
          color: darkred;
        }
        /* Overlay Styles */
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
          animation: fadeIn 0.3s ease-in-out;
        }
        /* Animations */
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @media (max-width: 600px) {
          .receipt-popup {
            padding: 20px;
          }
          .receipt-popup h3 {
            font-size: 1.3rem;
          }
          .receipt-popup p {
            font-size: 0.9rem;
          }
          .booking-container h2 {
            font-size: 1.3rem;
          }
          .booking-container button,
          .download-button {
            font-size: 0.9rem;
            padding: 10px 15px;
          }
        }
      `}</style>
    </div>
  );
}
