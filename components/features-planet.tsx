import { FaBed, FaHeadset, FaCalendarCheck, FaSwimmer, FaRegCalendarTimes, FaConciergeBell } from 'react-icons/fa';

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
              <FaBed className="w-12 h-12 mx-auto mb-4 text-blue-500"/>
              <h3 className="mb-2 text-xl font-bold text-gray-200">
                Luxurious Rooms
              </h3>
              <p className="text-gray-400">
                Choose from a variety of luxurious room options, each designed for comfort and style.
              </p>
            </article>
            <article className="text-center">
              <FaHeadset className="w-12 h-12 mx-auto mb-4 text-blue-500"/>
              <h3 className="mb-2 text-xl font-bold text-gray-200">
                24/7 Customer Support
              </h3>
              <p className="text-gray-400">
                Our dedicated team is here to help you 24/7 to ensure your stay is perfect.
              </p>
            </article>
            <article className="text-center">
              <FaCalendarCheck className="w-12 h-12 mx-auto mb-4 text-blue-500"/>
              <h3 className="mb-2 text-xl font-bold text-gray-200">
                Instant Booking
              </h3>
              <p className="text-gray-400">
                Use our seamless online booking system to check availability and book instantly.
              </p>
            </article>
            <article className="text-center">
              <FaSwimmer className="w-12 h-12 mx-auto mb-4 text-blue-500"/>
              <h3 className="mb-2 text-xl font-bold text-gray-200">
                Exclusive Amenities
              </h3>
              <p className="text-gray-400">
                Enjoy exclusive amenities including spas, pools, gyms, and fine dining experiences.
              </p>
            </article>
            <article className="text-center">
              <FaRegCalendarTimes className="w-12 h-12 mx-auto mb-4 text-blue-500"/>
              <h3 className="mb-2 text-xl font-bold text-gray-200">
                Clear Cancellation Policies
              </h3>
              <p className="text-gray-400">
                Flexible cancellation policies to accommodate your travel changes.
              </p>
            </article>
            <article className="text-center">
              <FaConciergeBell className="w-12 h-12 mx-auto mb-4 text-blue-500"/>
              <h3 className="mb-2 text-xl font-bold text-gray-200">
                Customizable Stays
              </h3>
              <p className="text-gray-400">
                Customize your stay with special requests, from room selection to dietary preferences.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
