import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "./logo";
import { HomeIcon, InformationCircleIcon, CollectionIcon, PhoneIcon } from '@heroicons/react/outline';

// Define an interface for the response to ensure type safety.
interface SessionInfo {
  isLoggedIn: boolean;
  userId?: number;
  name?: string;
  adminPermission?: string; // Add adminPermission to the interface
}

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function fetchSessionInfo() {
      try {
        const response = await fetch('/api/auth/session');
        const data: SessionInfo = await response.json();
        
        if (response.ok && data.isLoggedIn) {
          setIsLoggedIn(true);
          setUserName(data.name ?? null);
          setIsAdmin(data.adminPermission === 'yes'); // Check if the user is an admin
        } else {
          setIsLoggedIn(false);
          setUserName(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Failed to fetch session info:", error);
        setIsLoggedIn(false);
        setUserName(null);
        setIsAdmin(false);
      }
    }

    fetchSessionInfo();
  }, []);

  return (
    <header className="fixed top-0 z-50 w-full bg-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Logo />
            <nav className="ml-10">
              <ul className="flex space-x-4">
                <li><Link href="/" className="flex items-center text-gray-700 hover:text-white hover:bg-blue-500 rounded-full px-4 py-2 transition duration-300"><HomeIcon className="h-5 w-5 mr-2" aria-hidden="true" />Home</Link></li>
                <li><Link href="/hotels" className="flex items-center text-gray-700 hover:text-white hover:bg-blue-500 rounded-full px-4 py-2 transition duration-300"><CollectionIcon className="h-5 w-5 mr-2" aria-hidden="true" />Hotels</Link></li>
                <li><Link href="/about" className="flex items-center text-gray-700 hover:text-white hover:bg-blue-500 rounded-full px-4 py-2 transition duration-300"><InformationCircleIcon className="h-5 w-5 mr-2" aria-hidden="true" />About Us</Link></li>
                <li><Link href="/contact" className="flex items-center text-gray-700 hover:text-white hover:bg-blue-500 rounded-full px-4 py-2 transition duration-300"><PhoneIcon className="h-5 w-5 mr-2" aria-hidden="true" />Contact</Link></li>
              </ul>
            </nav>
          </div>
          <div className="flex items-center space-x-2">
            {isLoggedIn ? (
              <>
                <span className="sm:block bg-yellow-300 hover:bg-yellow-400 text-black py-2 px-4 rounded-full transition duration-300">
                  Hello, {userName}
                </span>
                {isAdmin ? (
                  <Link href="/admin_settings" className="sm:block bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full transition duration-300">Admin Settings</Link>
                ) : (
                  <Link href="/user_bookings" className="sm:block bg-yellow-300 hover:bg-yellow-400 text-black py-2 px-4 rounded-full transition duration-300">My Bookings</Link>
                )}
                <Link href="/api/auth/signout" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-full shadow hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 transition duration-300">Logout</Link>
              </>
            ) : (
              <>
                <Link href="/signin" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-full shadow hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 transition duration-300">Login</Link>
                <Link href="/signup" className="bg-gradient-to-r from-gray-700 to-gray-800 text-white py-2 px-4 rounded-full shadow hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-900 transition duration-300">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

