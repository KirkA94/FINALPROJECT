'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthButtons() {
  const { isAuthenticated, login, logout } = useAuth();

  const handleLogin = async () => {
    // Show a login form or redirect to a login page
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
          login(data.token); // Pass the JWT to the login function
        } else {
          alert('Invalid credentials');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('Failed to login');
      }
    }
  };

  const handleLogout = () => {
    logout(); // Clear the token and update the auth state
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