"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setCookie } from "nookies";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        const text = await response.text();
        console.error("Raw response text:", text);
        throw new Error("Response is not valid JSON");
      }

      setIsLoading(false);

      if (response.ok) {
        const userId = data.user_id; // assuming 'user_id' is returned in response

        setCookie(null, "user_id", userId, {
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: "/", // Accessible across the entire site
          sameSite: "lax", // Allows the cookie to be sent with same-site requests
          secure: process.env.NODE_ENV === "production", // Secure in production
        });

        setSuccessMessage("Signed in successfully!");
        router.push("/");
      } else {
        setErrorMessage(data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("An error occurred while signing in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Loader Component
  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <style jsx>{`
          .loader-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh; // Full screen height
            background-color: rgba(255, 255, 255, 0.5); // Semi-transparent background
          }
          .spinner {
            border: 6px solid rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            border-top: 6px solid blue;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Sign in to your account</h1>
      </div>

      {successMessage && <div className="mb-4 text-green-600">{successMessage}</div>}
      {errorMessage && <div className="mb-4 text-red-600">{errorMessage}</div>}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="form-input w-full py-2"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="corybarker@email.com"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="form-input w-full py-2"
              type="password"
              autoComplete="on"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="btn w-full bg-gradient-to-t from-blue-600 to-blue-500 text-white shadow hover:bg-opacity-80"
            disabled={isLoading}
          >
            Sign In
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <Link className="text-sm text-gray-700 underline hover:no-underline" href="/reset-password">
          Forgot password
        </Link>
      </div>
    </>
  );
}
