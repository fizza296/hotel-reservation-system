"use client";
import { useEffect, useState } from 'react';

interface User {
  name: string;
  email: string;
}

export default function Listings() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();

        if (response.ok) {
          setUsers(data);
          setErrorMessage('');
        } else {
          setErrorMessage(data.message || 'Failed to load users');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setErrorMessage('An error occurred while fetching users.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  if (errorMessage) {
    return <div className="text-red-600">{errorMessage}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-6">User Listings</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {users.map((user, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-bold text-gray-800">{user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
