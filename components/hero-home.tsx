// components/HeroHome.jsx

import Image from "next/image";
import Link from "next/link";

export default function HeroHome() {
  const hotels = [
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

  return (
    <section className="relative bg-gray-50 pt-24 pb-12"> {/* Increased top padding */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Content */}
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-extrabold text-gray-900 md:text-5xl"> {/* Reduced font size */}
            Find Your Ideal Hotel
          </h1>
          <p className="mx-auto mb-8 text-lg text-gray-600 max-w-3xl">
            Discover top-rated hotels at the best prices. Book your next stay with us!
          </p>
          {/* Booking Form */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <span className="px-4 text-gray-500">
                {/* SVG Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3C7.029 3 3 7.029 3 12s4.029 9 9 9 9-4.029 9-9-4.029-9-9-9z m0 4.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 9c-2.209 0-4-1.792-4-4 0-.351.074-.687.204-1 .13-.312.317-.597.546-.854a5.978 5.978 0 013.25-1.596M15.75 13.5a5.98 5.98 0 011.596 3.25c.257.23.542.416.854.546.313.13.649.204 1 .204"
                  />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Location"
                className="py-2 px-4 w-48 sm:w-64 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2 px-6 transition duration-300"
            >
              Search
            </button>
          </div>
        </div>
        {/* Hotels Grid */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"> {/* Increased top margin */}
          {hotels.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="relative h-64">
                <Image
                  src={hotel.imageSrc}
                  alt={hotel.name}
                  layout="fill"
                  objectFit="cover"
                  className="transform hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-800">{hotel.name}</h3>
                <p className="mt-2 text-gray-600">{hotel.description}</p>
                <Link
                  href={{
                    pathname: "/rooms",
                    query: { hotel_id: hotel.id },
                  }}
                  className="mt-4 inline-block text-blue-600 hover:text-blue-700 font-medium"
                >
                  View details &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
        {/* View More Button */}
        <div className="mt-16 flex justify-center">
          <Link
            href="/hotels"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg py-3 px-8 transition duration-300"
          >
            View More Hotels
          </Link>
        </div>
      </div>
    </section>
  );
}
