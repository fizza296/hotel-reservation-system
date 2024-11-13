import Image from "next/image";

export default function HotelFeatures() {
  return (
    <section className="relative before:absolute before:inset-0 before:-z-20 before:bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="mx-auto max-w-3xl pb-16 text-center md:pb-20">
            <h2 className="text-3xl font-bold text-gray-200 md:text-4xl">
              Enhance Your Stay with Our Premium Services
            </h2>
          </div>
          {/* Feature Highlights */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <article className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-4 text-blue-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 6h9m-9 4.5h9m-9 4.5h9m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mb-2 text-xl font-bold text-gray-200">
                Luxurious Rooms
              </h3>
              <p className="text-gray-400">
                Choose from a variety of luxurious room options, each designed for comfort and style.
              </p>
            </article>
            <article className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-4 text-blue-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0h6m-6 0H6m12 4.5H6m15-9V18a3 3 0 01-3 3H6a3 3 0 01-3-3V12m18 0v-3a3 3 0 00-3-3H6a3 3 0 00-3 3v3m18 0H3" />
              </svg>
              <h3 className="mb-2 text-xl font-bold text-gray-200">
                24/7 Customer Support
              </h3>
              <p className="text-gray-400">
                Our dedicated team is here to help you 24/7 to ensure your stay is perfect.
              </p>
            </article>
            <article className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-4 text-blue-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 8.5V12m0 0v3.5m0-3.5h3.5m-3.5 0H6.5" />
              </svg>
              <h3 className="mb-2 text-xl font-bold text-gray-200">
                Instant Booking
              </h3>
              <p className="text-gray-400">
                Use our seamless online booking system to check availability and book instantly.
              </p>
            </article>
            <article className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-4 text-blue-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 9L12 3.75 7.5 9M12 3.75v16.5" />
              </svg>
              <h3 className="mb-2 text-xl font-bold text-gray-200">
                Exclusive Amenities
              </h3>
              <p className="text-gray-400">
                Enjoy exclusive amenities including spas, pools, gyms, and fine dining experiences.
              </p>
            </article>
            <article className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-4 text-blue-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <h3 className="mb-2 text-xl font-bold text-gray-200">
                Best Rate Guarantee
              </h3>
              <p className="text-gray-400">
                Book directly with us to enjoy the best rates available on the market.
              </p>
            </article>
            <article className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-4 text-blue-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v6m0 0V3m0 6h6.5M12 9H5.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mb-2 text-xl font-bold text-gray-200">
                Customizable Stays
              </h3>
              <p className="text-gray-400">
                Customize your stay with special requests, right from room selection to food preferences.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
