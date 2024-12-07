"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { setCookie } from 'nookies';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      setIsLoading(false);

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        const text = await response.text();
        console.error('Raw response text:', text);
        throw new Error('Response is not valid JSON');
      }

      if (response.ok) {
        const userId = data.user_id;  // assuming 'user_id' is returned in response

        // Set the cookie as "session" with value "SESSION_<user_id>"
        setCookie(null, 'user_id', userId, {
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: '/',                  // Accessible across the entire site
          sameSite: 'lax',            // Allows the cookie to be sent with same-site requests
          secure: process.env.NODE_ENV === 'production', // Secure in production
        }
       );

        setSuccessMessage('Signed in successfully!');
        setErrorMessage('');
        router.push('/');  // Redirect to home page
      } else {
        setErrorMessage(data.message || 'Invalid email or password');
        setSuccessMessage('');
      }
    } catch (error: unknown) {
      setErrorMessage('An error occurred while signing in. Please try again.');
      setIsLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <style jsx>{`
          .loader-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 80vh;
            background-color: #f0f4f8;
          }

          .spinner {
            border: 8px solid #f3f3f3;
            border-top: 8px solid #3b82f6;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            animation: spin 1.5s linear infinite;
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
            className={`btn w-full bg-gradient-to-t from-blue-600 to-blue-500 text-white shadow hover:bg-opacity-80 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
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


