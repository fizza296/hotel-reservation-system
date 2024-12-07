"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// Define the Hotel interface
interface Hotel {
  id: number;
  name: string;
  imageSrc: string;
  description: string;
}

export default function HeroHome() {
  const router = useRouter();
  const [location, setLocation] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Properly typed hotels array
  const hotels: Hotel[] = [
    {
      id: 50,
      name: "Mövenpick",
      imageSrc: "/images/image.png",
      description: "Luxurious comfort with beautiful views.",
    },
    {
      id: 58,
      name: "Pearl Continental",
      imageSrc: "/images/image2.jpg",
      description: "A perfect comfort with modern rooms.",
    },
    {
      id: 53,
      name: "Marriott Hotel",
      imageSrc: "/images/image3.jpg",
      description: "Experience the heart of the city.",
    },
  ];

  // Fetch area suggestions based on user input
  useEffect(() => {
    if (location.trim() === "") {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);

    // Debounce the API call
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      fetch(`/api/auth/get_areas?query=${encodeURIComponent(location)}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Error: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          setSuggestions(data);
          setShowSuggestions(true);
        })
        .catch((error) => {
          console.error("Error fetching area suggestions:", error);
          setSuggestions([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 300); // 300ms debounce

    // Cleanup timeout on unmount
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [location]);

  // Handle clicks outside the suggestions dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSuggestionClick = (suggestion: string) => {
    setLocation(suggestion);
    setShowSuggestions(false);
  };

  const handleSearch = () => {
    if (location.trim() === "") {
      // Optionally, you can show a validation message here
      return;
    }
    // Navigate to the hotels page with the selected area as a query parameter
    router.push(`/hotels?area=${encodeURIComponent(location.trim())}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    // Set the background to white
    <section className="relative bg-white pt-28 sm:pt-32 pb-16">
      {/* Optional: Increased horizontal padding on large screens */}
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Hero Content */}
        <div className="text-center">
          <h1 className="mb-6 text-5xl font-extrabold text-gray-900 sm:text-6xl">
            Find Your Ideal Hotel
          </h1>
          <p className="mx-auto mb-10 text-xl text-gray-700 max-w-2xl">
            Discover top-rated hotels at the best prices. Book your next stay with us!
          </p>
          {/* Booking Form */}
          <div
            className="flex flex-col items-center justify-center gap-6 sm:flex-row relative w-full sm:w-auto"
            ref={dropdownRef}
          >
            <div className="relative w-full sm:w-96">
              <div className="flex items-center border border-gray-300 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                <span className="px-4 text-gray-500">
                  {/* Updated SVG Search Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.387a1 1 0 01-1.414 1.414l-4.387-4.387zM14 8a6 6 0 11-12 0 6 6 0 0112 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search for a location"
                  aria-label="Search for a location"
                  className="flex-1 py-3 px-4 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 text-lg"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowSuggestions(true);
                  }}
                  onKeyDown={handleKeyDown}
                />
                {isLoading && (
                  <span className="px-4">
                    {/* Loading Spinner */}
                    <svg
                      className="animate-spin h-5 w-5 text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                  </span>
                )}
              </div>
              {/* Suggestions Dropdown */}
              {showSuggestions && (
                <ul className="absolute left-0 right-0 z-20 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {isLoading ? (
                    <li className="px-5 py-3 text-center text-gray-500">Loading...</li>
                  ) : suggestions.length > 0 ? (
                    suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="px-5 py-3 hover:bg-blue-100 cursor-pointer transition-colors duration-200"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </li>
                    ))
                  ) : (
                    <li className="px-5 py-3 text-center text-gray-500">No suggestions found.</li>
                  )}
                </ul>
              )}
            </div>
            <button
              type="button"
              onClick={handleSearch}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-full py-3 px-8 transition-colors duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Search
            </button>
          </div>
        </div>
        {/* Hotels Grid */}
        <div className="mt-20 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {hotels.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105"
            >
              <div className="relative h-64">
                <Image
                  src={hotel.imageSrc}
                  alt={hotel.name}
                  layout="fill"
                  objectFit="cover"
                  className="transform hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-800">{hotel.name}</h3>
                <p className="mt-3 text-gray-600">{hotel.description}</p>
                <Link
                  href={{
                    pathname: "/rooms",
                    query: { hotel_id: hotel.id },
                  }}
                  className="mt-6 inline-block text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                  View details &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
        {/* View More Button */}
        <div className="mt-24 flex justify-center">
          <Link
            href="/hotels"
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-full py-4 px-10 transition-colors duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            View More Hotels
          </Link>
        </div>
      </div>
    </section>
  );
}
