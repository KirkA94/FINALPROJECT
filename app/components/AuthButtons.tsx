'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';
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
      const response = await fetch('/api/users/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const { accessToken, refreshToken, user } = await response.json();
        // Pass refreshToken to login or handle it elsewhere
        login(accessToken, user, refreshToken); // Assuming your login function accepts refreshToken
        alert('Login successful!');
        router.push('/dashboard');
      } else {
        const errorData = await response.json();
        alert(`Login failed: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred while trying to log in. Please try again later.');
    }
  };

  const handleLogout = () => {
    logout();
    alert('You have logged out.');
    router.push('/');
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