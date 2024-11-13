"use client";
import { useState } from 'react';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
        }),
      });

      const data = await response.json();

      setIsLoading(false);

      if (response.ok) {
        setSuccessMessage('Account created successfully!');
        setErrorMessage('');
        // You could also redirect the user or reset the form fields here
      } else {
        setErrorMessage(data.message || 'Error signing up');
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Create your account</h1>
      </div>

      {/* Success message */}
      {successMessage && <div className="mb-4 text-green-600">{successMessage}</div>}

      {/* Error message */}
      {errorMessage && <div className="mb-4 text-red-600">{errorMessage}</div>}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label
              className="mb-1 block text-sm font-medium text-gray-700"
              htmlFor="name"
            >
              Full name
            </label>
            <input
              id="name"
              className="form-input w-full py-2"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Corey Barker"
              required
            />
          </div>
          <div>
            <label
              className="mb-1 block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
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
            <label
              className="mb-1 block text-sm font-medium text-gray-700"
              htmlFor="phone"
            >
              Phone
            </label>
            <input
              id="phone"
              className="form-input w-full py-2"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(+750) 932-8907"
              required
            />
          </div>
          <div>
            <label
              className="mb-1 block text-sm font-medium text-gray-700"
              htmlFor="password"
            >
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
        <div className="mt-6 space-y-3">
          <button
            type="submit"
            className={`btn w-full bg-gradient-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow hover:bg-[length:100%_150%] ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
          <div className="text-center text-sm italic text-gray-400">Or</div>
          <button className="btn w-full bg-gradient-to-t from-gray-900 to-gray-700 bg-[length:100%_100%] bg-[bottom] text-white shadow hover:bg-[length:100%_150%]">
            Continue with GitHub
          </button>
        </div>
      </form>

      {/* Bottom link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          By signing up, you agree to the{' '}
          <a
            className="whitespace-nowrap font-medium text-gray-700 underline hover:no-underline"
            href="#0"
          >
            Terms of Service
          </a>{' '}
          and{' '}
          <a
            className="whitespace-nowrap font-medium text-gray-700 underline hover:no-underline"
            href="#0"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </>
  );
}
