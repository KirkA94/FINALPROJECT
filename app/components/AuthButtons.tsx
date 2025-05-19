'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext'; // Ensure correct path
import { useRouter } from 'next/navigation';

export default function AuthButtons() {
  const { isAuthenticated, login, logout } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    const username = prompt('Enter your username:');
    const password = prompt('Enter your password:');

    if (username && password) {
      try {
        const response = await fetch('/api/users/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          const data = await response.json();
          login(data.token, data.user); // Pass the JWT and user object to the login function
          alert('Login successful!');
          router.push('/dashboard'); // Redirect after login
        } else {
          alert('Invalid credentials');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('Failed to login. Please try again.');
      }
    }
  };

  const handleLogout = () => {
    logout(); // Clear the token and update the auth state
    alert('You have logged out.');
    router.push('/'); // Redirect to home after logout
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