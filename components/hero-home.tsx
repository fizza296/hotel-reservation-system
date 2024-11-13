import Image from "next/image";

export default function HeroHome() {
  const hotels = [
    { id: 1, name: "Hotel Sunshine", imageSrc: "/images/hotel-01.jpeg", description: "Luxurious comfort with sea views." },
    { id: 2, name: "Mountain Escape", imageSrc: "/images/hotel-02.jpeg", description: "A perfect mountain retreat." },
    { id: 3, name: "Urban Hotel Central", imageSrc: "/images/hotel-03.jpeg", description: "Experience the heart of the city." },
    { id: 4, name: "Beachfront Villa", imageSrc: "/images/hotel-04.jpeg", description: "Your private beach house." },
  ];

  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Hero content */}
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">
          {/* Section header */}
          <div className="text-center pb-12 md:pb-16">
            <h1 className="mb-4 text-5xl font-bold md:text-6xl">
              Find Your Ideal Hotel
            </h1>
            <p className="mx-auto mb-8 text-lg text-gray-700 max-w-3xl">
              Discover top-rated hotels at the best prices. Book your next stay with us!
            </p>
            {/* Booking form */}
            <div className="mt-8 flex justify-center gap-4 flex-wrap">
              <div className="flex items-center border rounded-lg overflow-hidden">
                <span className="px-3 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3C7.029 3 3 7.029 3 12s4.029 9 9 9 9-4.029 9-9-4.029-9-9-9z m0 4.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 9c-2.209 0-4-1.792-4-4 0-.351.074-.687.204-1 .13-.312.317-.597.546-.854a5.978 5.978 0 013.25-1.596M15.75 13.5a5.98 5.98 0 011.596 3.25c.257.23.542.416.854.546.313.13.649.204 1 .204" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Location"
                  className="py-2 px-4 w-48 sm:w-64"
                />
              </div>
              <input
                type="date"
                placeholder="Check-in date"
                className="w-40 sm:w-56 py-2 px-4 border rounded-lg"
              />
              <input
                type="date"
                placeholder="Check-out date"
                className="w-40 sm:w-56 py-2 px-4 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Number of adults"
                className="w-32 sm:w-40 py-2 px-4 border rounded-lg"
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 px-6"
              >
                Search
              </button>
            </div>
          </div>
          {/* Hotels grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {hotels.map(hotel => (
              <div key={hotel.id} className="relative">
                <Image
                  className="rounded-lg"
                  src={hotel.imageSrc}
                  alt={hotel.name}
                  width={300}
                  height={200}
                  layout="responsive"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{hotel.name}</h3>
                  <p className="text-sm text-gray-600">{hotel.description}</p>
                  <a href="#0" className="mt-2 inline-block text-blue-500 hover:text-blue-600">
                    View details →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
