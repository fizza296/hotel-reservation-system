import Logo from "./logo";

export default function Footer({ border = false }: { border?: boolean }) {
  return (
    <footer className="bg-white text-gray-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Top area: Simplified content with reservation info */}
        <div className={`py-8 md:py-12 text-center ${border ? "border-t [border-image:linear-gradient(to_right,transparent,theme(colors.slate.200),transparent)1]" : ""}`}>
          <div>
            <Logo />
          </div>
          <p className="text-sm mt-2">
            &copy; {new Date().getFullYear()} YourHotelName - All rights reserved.
          </p>
          <p className="text-sm mt-2">
            
          </p>
        </div>
      </div>
    </footer>
  );
}
