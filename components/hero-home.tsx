"use client";
import { useState, useEffect } from "react";
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
  const [currentHotelIndex, setCurrentHotelIndex] = useState<number>(0);

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
    {
      id: 67,
      name: "Ritz-Carlton",
      imageSrc: "/images/image4.jpg",
      description: "Unparalleled luxury and elegance.",
    },
    {
      id: 72,
      name: "Hilton Garden",
      imageSrc: "/images/image5.jpg",
      description: "Modern amenities for a relaxing stay.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHotelIndex((prevIndex) => (prevIndex + 1) % hotels.length);
    }, 3000); // Change slide every 3 seconds
    return () => clearInterval(interval);
  }, [hotels.length]);

  return (
    <motion.section
      className="relative bg-gradient-to-r from-primary-light via-primary to-primary-dark pt-24 sm:pt-32 pb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="text-center text-accent-light">
          <h1 className="mb-6 text-5xl sm:text-6xl font-extrabold font-inter text-accent-light">
            Discover Top Hotels
          </h1>
          <p className="mx-auto mb-10 text-lg sm:text-xl font-roboto text-accent-light max-w-2xl">
            Explore the best hotels and find your perfect stay!
          </p>
        </div>
        {/* Carousel */}
        <div className="relative overflow-hidden h-96 w-full max-w-4xl mx-auto">
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
      </div>
    </motion.section>
  );
}
