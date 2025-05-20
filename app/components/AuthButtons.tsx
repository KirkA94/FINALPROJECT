'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext'; // Adjust the path to your AuthContext
import { useRouter } from 'next/navigation';

export default function AuthButtons() {
  const { isAuthenticated, login, logout } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    const username = prompt('Enter your username:');
    const password = prompt('Enter your password:');

    if (!username || !password) {
      alert('Username and password are required.');
      return;
    }

    try {
      const response = await fetch('/api/users/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token && data.user) {
          login(data.token, data.user); // Log the user in
          alert('Login successful!');
          router.push('/dashboard'); // Redirect to dashboard
        } else {
          console.error('Unexpected response format:', data);
          alert('Unexpected response format from the server. Please contact support.');
        }
      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData);
        alert(`Login failed: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred while trying to login. Please try again later.');
    }
  };

  const handleLogout = () => {
    logout(); // Log the user out
    alert('You have logged out.');
    router.push('/'); // Redirect to home
  };

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={handleLogout}>Sign Out</button>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}