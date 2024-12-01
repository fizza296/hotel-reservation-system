import { useEffect, useState } from "react";

type ToastProps = {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
};

export default function Toast({ message, type = "error", onClose }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show the toast
    setVisible(true);

    // Auto-dismiss after 3 seconds
    const timer = setTimeout(() => {
      setVisible(false);
      // Wait for fade-out transition to finish
      setTimeout(onClose, 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <div
      className={`fixed top-5 right-5 ${bgColor} text-white px-4 py-2 rounded shadow-lg z-50 transform transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {message}
    </div>
  );
}
