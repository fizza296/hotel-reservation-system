"use client";
import Header from "@/components/ui/header";
import Logo from "@/components/ui/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Header component */}
      <Header />

      <main className="relative flex grow items-center justify-center">
        {/* Background decoration */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 -translate-x-1/3"
          aria-hidden="true"
        >
          <div className="h-96 w-96 rounded-full bg-gradient-to-tr from-blue-500 opacity-70 blur-[200px]"></div>
        </div>

        {/* Content */}
        <div className="w-full px-4 sm:px-6">
          <div className="mx-auto w-full max-w-4xl">
            <div className="py-16 md:py-20">{children}</div>
          </div>
        </div>
      </main>
    </>
  );
}
