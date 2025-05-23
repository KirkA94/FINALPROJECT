'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

type Poll = {
  id: number;
  question: string;
  options: { id: number; text: string; votes: number }[];
  user: { username: string };
};

export default function PollPage({ params }: { params: { id: string } }) {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const pollId = parseInt(params.id, 10); // Parse `id` to integer

  const fetchPoll = useCallback(async () => {
    try {
      if (isNaN(pollId)) {
        setError('Invalid poll ID.');
        return;
      }

      // Fetch the poll data
      const response = await fetch(`/api/polls/${pollId}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError('Poll not found.');
        } else {
          setError('Failed to fetch poll.');
        }
        return;
      }

      const data = await response.json();
      setPoll(data);
    } catch (err) {
      console.error('Error fetching poll:', err);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [pollId]);

  useEffect(() => {
    fetchPoll();
  }, [fetchPoll]);

  if (loading) return <p>Loading poll...</p>;

  if (error)
    return (
      <div style={{ color: 'red', padding: '20px' }}>
        <p>{error}</p>
        <button
          onClick={() => {
            setError(null); // Reset error state
            router.push('/'); // Navigate back to home
          }}
          style={backButtonStyle}
        >
          Go Back to Home
        </button>
      </div>
    );

  if (!poll) return <p>Poll not found.</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>{poll.question}</h1>
      <p>Created by: {poll.user.username}</p>

      <ul>
        {poll.options.map((option) => (
          <li key={option.id}>
            <strong>{option.text}</strong> - Votes: {option.votes}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Inline style for the back button
const backButtonStyle = {
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
  marginTop: '10px',
  transition: 'background-color 0.3s ease',
};