'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext'; // Adjust the path as required
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { isAuthenticated, logout } = useAuth(); // Access authentication state and logout function
  const router = useRouter();

  useEffect(() => {
    // Redirect unauthenticated users to the home page
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout(); // Log the user out
    router.push('/'); // Redirect to the home page after logout
  };

  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <p>Redirecting to the home page...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Welcome to Your Dashboard</h1>
      <p>You are successfully logged in. Manage your polls below.</p>
      <div style={{ marginTop: '30px' }}>
        <h2>Manage Your Polls</h2>
        <button
          onClick={() => router.push('/polls')}
          style={buttonStyle('#007bff')}
        >
          View Polls
        </button>
        <button
          onClick={() => router.push('/polls/create')}
          style={buttonStyle('#28a745')}
        >
          Create New Poll
        </button>
      </div>
      <div style={{ marginTop: '30px' }}>
        <button onClick={handleLogout} style={buttonStyle('#dc3545')}>
          Logout
        </button>
      </div>
    </div>
  );
}

// Reusable button styles
const buttonStyle = (bgColor: string) => ({
  margin: '10px',
  padding: '10px 20px',
  fontSize: '16px',
  backgroundColor: bgColor,
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
});