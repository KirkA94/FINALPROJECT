'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

type Poll = {
  id: number;
  question: string;
  options: { id: number; text: string; votes: number }[];
  user: { username: string };
};

export default function PollPage({ params }: { params: Promise<{ id: string }> }) {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchPoll = useCallback(async () => {
    try {
      const resolvedParams = await params; // Await the params promise
      const pollId = Number(resolvedParams.id);

      if (isNaN(pollId)) {
        throw new Error('Invalid poll ID.');
      }

      // Fetch the poll data
      const response = await fetch(`/api/polls/${pollId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch poll.');
      }

      const data = await response.json();
      setPoll(data);
    } catch (err) {
      console.error('Error fetching poll:', err);
      setError('Failed to load poll. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchPoll();
  }, [fetchPoll]);

  if (loading) return <p>Loading poll...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

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