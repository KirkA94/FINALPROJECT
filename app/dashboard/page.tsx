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
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      logout(); // Log the user out
      router.push('/'); // Redirect to the home page after logout
    }
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
        <Button
          label="View Polls"
          onClick={() => router.push('/polls')}
          bgColor="#007bff"
        />
        <Button
          label="Create New Poll"
          onClick={() => router.push('/polls/create')}
          bgColor="#28a745"
        />
      </div>
      <div style={{ marginTop: '30px' }}>
        <Button label="Logout" onClick={handleLogout} bgColor="#dc3545" />
      </div>
    </div>
  );
}

// Reusable Button Component
const Button: React.FC<{ label: string; onClick: () => void; bgColor: string }> = ({
  label,
  onClick,
  bgColor,
}) => (
  <button
    onClick={onClick}
    style={{
      margin: '10px',
      padding: '10px 20px',
      fontSize: '16px',
      backgroundColor: bgColor,
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    }}
  >
    {label}
  </button>
);