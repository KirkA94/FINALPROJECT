'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext'; // Adjust the path to match your AuthContext file
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
    alert('You have been logged out.');
    router.push('/'); // Redirect to the home page after logout
  };

  if (!isAuthenticated) {
    return <p>Redirecting...</p>; // Display while redirection occurs
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Welcome to Your Dashboard</h1>
      <p>You are successfully logged in.</p>
      <div style={{ marginTop: '20px' }}>
        <h2>Manage Your Polls</h2>
        <p>Here you can view and manage your polls.</p>
        <button
          onClick={() => router.push('/polls')}
          style={{
            margin: '10px',
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          View Polls
        </button>
        <button
          onClick={() => router.push('/create-poll')}
          style={{
            margin: '10px',
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Create New Poll
        </button>
      </div>
      <div style={{ marginTop: '30px' }}>
        <button
          onClick={handleLogout}
          style={{
            margin: '10px',
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}