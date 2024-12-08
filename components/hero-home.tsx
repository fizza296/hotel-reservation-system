"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Define the Hotel interface
interface Hotel {
  id: number;
  name: string;
  imageSrc: string;
  description: string;
}

export default function HeroHome() {
  const router = useRouter();
  const [currentHotelIndex, setCurrentHotelIndex] = useState<number>(0);
  const [location, setLocation] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      description: "Perfect comfort with modern rooms.",
    },
    {
      id: 53,
      name: "Marriott Hotel",
      imageSrc: "/images/image3.jpg",
      description: "Experience the heart of the city.",
    },
    // You can add more hotels here if needed
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHotelIndex((prevIndex) => (prevIndex + 1) % hotels.length);
    }, 3000); // Change slide every 3 seconds
    return () => clearInterval(interval);
  }, [hotels.length]);

  useEffect(() => {
    if (location.trim() === "") {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setIsLoading(true);
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
    }, 300);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
      return;
    }
    router.push(`/hotels?area=${encodeURIComponent(location.trim())}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <motion.section
      className="relative bg-gradient-radial from-blue-100 via-blue-200 to-blue-300 pt-24 sm:pt-32 pb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="text-center text-accent-light">
          <h1 className="mb-6 text-5xl sm:text-6xl font-extrabold font-inter text-accent-light">
            Find Your Ideal Hotel
          </h1>
          <p className="mx-auto mb-10 text-lg sm:text-xl font-roboto text-accent-light max-w-2xl">
            Discover top-rated hotels at the best prices. Book your next stay with us!
          </p>

          {/* Booking Form */}
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row relative w-full sm:w-auto" ref={dropdownRef}>
            <div className="relative w-full sm:w-96">
              <div className="flex items-center border border-primary-light rounded-full bg-accent-dark bg-opacity-30 backdrop-filter backdrop-blur-lg shadow-lg hover:bg-opacity-40 transition-all duration-300">
                <span className="px-4 text-accent-light">
                  {/* Search Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
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
                  className="flex-1 py-3 px-4 bg-transparent focus:outline-none text-accent-light placeholder-accent-light placeholder-opacity-70 text-lg font-roboto"
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
                    <svg className="animate-spin h-5 w-5 text-accent-light" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                  </span>
                )}
              </div>
              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {showSuggestions && (
                  <motion.ul
                    className="absolute left-0 right-0 z-30 mt-1 bg-accent-dark bg-opacity-90 backdrop-filter backdrop-blur-lg border border-primary-light rounded-lg shadow-lg max-h-60 overflow-y-auto"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isLoading ? (
                      <li className="px-5 py-3 text-center text-accent-light">Loading...</li>
                    ) : suggestions.length > 0 ? (
                      suggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          className="px-5 py-3 hover:bg-primary-light hover:text-accent-dark cursor-pointer transition-colors duration-200"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </li>
                      ))
                    ) : (
                      <li className="px-5 py-3 text-center text-accent-light">No suggestions found.</li>
                    )}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
            {/* Updated Search Button */}
            <button
              type="button"
              onClick={handleSearch}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-accent-light font-semibold rounded-full py-3 px-8 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none"
            >
              Search
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative overflow-hidden h-96 w-full max-w-4xl mx-auto mt-12 mb-12">
          <AnimatePresence>
            <motion.div
              key={hotels[currentHotelIndex].id}
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.8 }}
            >
              <div className="w-full max-w-3xl bg-accent-light bg-opacity-90 backdrop-filter backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden">
                <div className="relative h-64">
                  <Image
                    src={hotels[currentHotelIndex].imageSrc}
                    alt={hotels[currentHotelIndex].name}
                    fill
                    style={{ objectFit: "cover" }}
                    className="transform hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-semibold text-primary-dark font-inter">
                    {hotels[currentHotelIndex].name}
                  </h3>
                  <p className="mt-3 text-accent-dark font-roboto">
                    {hotels[currentHotelIndex].description}
                  </p>
                  <Link
                    href={{
                      pathname: "/rooms",
                      query: { hotel_id: hotels[currentHotelIndex].id },
                    }}
                    className="mt-6 inline-block text-primary-light hover:text-primary-dark font-medium transition-colors duration-200"
                  >
                    View details &rarr;
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Updated View More Hotels Button */}
        <div className="mt-24 flex justify-center">
          <Link
            href="/hotels"
            className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-accent-light font-semibold rounded-full py-4 px-10 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 block text-center"
          >
            View More Hotels
          </Link>
        </div>
      </div>
    </motion.section>
  );
}