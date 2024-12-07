"use client";

import { useEffect, useState } from "react";
import moment from "moment";
import { useRouter } from "next/navigation";
import { jsPDF } from "jspdf"; // Import jsPDF

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

type Receipt = {
  receipt_id: number;
  booking_id: number;
  user_id: number;
  receipt_date: string;
  username: string;
  hotel_name: string;
  room_type: string;
  check_in_date: string;
  check_out_date: string;
  special_requests: string | null;
};

export default function UserBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);

      try {
        const res = await fetch(`/api/auth/user_bookings`, { credentials: "include" });
        const data = await res.json();

        if (res.status === 401) {
          setMessage(data.message);
        } else if (Array.isArray(data) && data.length === 0) {
          setMessage("No previous bookings found.");
        } else if (Array.isArray(data)) {
          setBookings(data);
        } else {
          setMessage("Unexpected response from the server.");
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

  const goToUpdateBooking = (bookingId: number) => {
    router.push(`/update_bookings?booking_id=${bookingId}`);
  };

  const isBookingWithin24Hours = (createdAt: string): boolean => {
    const createdTime = moment(createdAt);
    const now = moment();
    return now.diff(createdTime, "hours") <= 24;
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
  // Function to fetch receipt data
  const fetchReceipt = async (bookingId: number) => {
    try {
      const res = await fetch(`/api/auth/receipts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_id: bookingId }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setSelectedReceipt(data);
        setIsPopupVisible(true);
      } else {
        setMessage(data.message || "Failed to create receipt.");
      }
    } catch (error) {
      setMessage("Error creating receipt.");
      console.error("Error:", error);
    }
  };

  // Function to download receipt as PDF using jsPDF
  const handleDownloadReceipt = () => {
    if (!selectedReceipt) {
      setMessage("No receipt available to download.");
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
    } = selectedReceipt;

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
      {
        label: "Check-in Date",
        value: new Date(check_in_date).toLocaleDateString(),
      },
      {
        label: "Check-out Date",
        value: new Date(check_out_date).toLocaleDateString(),
      },
      { label: "Special Requests", value: special_requests || "None" },
      {
        label: "Receipt Date",
        value: new Date(receipt_date).toLocaleString(),
      },
    ];

    let currentY = 60;
    details.forEach((detail) => {
      doc.setFont("helvetica", "bolditalic");
      doc.text(`${detail.label}:`, pageWidth / 2 - 30, currentY, {
        align: "right",
      });
      doc.setFont("helvetica", "normal");
      doc.text(detail.value.toString(), pageWidth / 2 + 10, currentY, {
        align: "left",
      });
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

  // Function to close the receipt popup
  const handleClosePopup = () => {
    setIsPopupVisible(false);
    setSelectedReceipt(null);
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
        {bookings.map((booking, index) => (
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
                  {booking.status === "cancelled" ? "Cancelled" : "Confirmed"}
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
            <div className="mt-6 flex justify-end gap-4">
              {isBookingWithin24Hours(booking.created_at) && booking.status !== "cancelled" && (
                <>
                  <button
                    onClick={() => goToUpdateBooking(booking.booking_id)}
                    className="rounded-md bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Update Booking
                  </button>
                  <button
                    onClick={() => handleCancel(booking.booking_id)}
                    className="rounded-md bg-red-600 px-4 py-2 text-white shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Cancel Booking
                  </button>
                </>
              )}
              {/* Download Receipt Button */}
              <button
                onClick={() => fetchReceipt(booking.booking_id)}
                className="rounded-md bg-green-600 px-4 py-2 text-white shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Download Receipt
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Receipt Popup */}
      {isPopupVisible && selectedReceipt && (
        <>
          <div className="overlay"></div>
          <div
            className="receipt-popup"
            role="dialog"
            aria-modal="true"
            aria-labelledby="receipt-title"
          >
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
              <p>
                <strong>Receipt ID:</strong> {selectedReceipt.receipt_id}
              </p>
              <p>
                <strong>Booking ID:</strong> {selectedReceipt.booking_id}
              </p>
              <p>
                <strong>User ID:</strong> {selectedReceipt.user_id}
              </p>
              <p>
                <strong>Username:</strong> {selectedReceipt.username}
              </p>
              <p>
                <strong>Hotel Name:</strong> {selectedReceipt.hotel_name}
              </p>
              <p>
                <strong>Room Type:</strong> {selectedReceipt.room_type}
              </p>
              <p>
                <strong>Check-in Date:</strong>{" "}
                {new Date(selectedReceipt.check_in_date).toLocaleDateString()}
              </p>
              <p>
                <strong>Check-out Date:</strong>{" "}
                {new Date(selectedReceipt.check_out_date).toLocaleDateString()}
              </p>
              <p>
                <strong>Special Requests:</strong>{" "}
                {selectedReceipt.special_requests || "None"}
              </p>
              <p>
                <strong>Receipt Date:</strong>{" "}
                {new Date(selectedReceipt.receipt_date).toLocaleString()}
              </p>
            </div>

            {/* Download PDF Button */}
            <button
              onClick={handleDownloadReceipt}
              className="download-pdf-button"
              aria-label="Download PDF"
            >
              Download PDF
            </button>
          </div>
        </>
      )}

      <style jsx>{`
        /* Booking Container Styles */
        .mx-auto {
          max-width: 4xl;
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
          z-index: 1001;
          color: #000000;
          animation: fadeIn 0.3s ease-in-out;
          overflow-y: auto;
          max-height: 90vh;
        }
        .popup-heading {
          text-align: center;
          font-size: 1.8rem;
          color: #0070f3;
          margin-bottom: 20px;
        }
        .receipt-details p {
          margin: 10px 0;
          font-size: 1rem;
        }
        .download-pdf-button {
          display: block;
          width: 100%;
          padding: 12px 0;
          background-color: #0070f3;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.3s ease;
          margin-top: 20px;
        }
        .download-pdf-button:hover {
          background-color: #005bb5;
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
          color: red;
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
          z-index: 1000;
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
        /* Responsive Styles */
        @media (max-width: 600px) {
          .receipt-popup {
            padding: 20px;
          }
          .popup-heading {
            font-size: 1.3rem;
          }
          .receipt-details p {
            font-size: 0.9rem;
          }
          .download-pdf-button {
            font-size: 0.9rem;
            padding: 10px 0;
          }
        }
      `}</style>
    </div>
  );
}
