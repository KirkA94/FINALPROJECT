'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext'; // Updated path to match the correct location

type Poll = {
  id: number;
  question: string;
  options: { id: number; text: string; votes: number }[];
};

export default function PollsDashboard() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true); // Default to true for initial loading
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth(); // Get the authentication state
  const router = useRouter();

  const fetchPolls = useCallback(async () => {
    try {
      const response = await fetch('/api/polls');
      if (!response.ok) {
        throw new Error('Failed to fetch polls.');
      }
      const data = await response.json();
      setPolls(data);
    } catch (error) {
      console.error(error);
      setError('Unable to load polls. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPolls();
  }, [fetchPolls]);

  if (loading) return <p>Loading polls...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Polls Dashboard</h1>
      {isAuthenticated && (
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={() => router.push('/polls/create')} // Redirect to poll creation page
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Create Poll
          </button>
        </div>
      )}
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : polls.length > 0 ? (
        <div>
          {polls.map((poll) => (
            <div
              key={poll.id}
              style={{
                marginBottom: '20px',
                padding: '15px',
                border: '1px solid #ddd',
                borderRadius: '5px',
              }}
            >
              <Link
                href={`/polls/${poll.id}`}
                style={{ textDecoration: 'none', color: '#007bff' }}
              >
                <h2>{poll.question}</h2>
              </Link>
              <ul>
                {poll.options.map((option) => (
                  <li key={option.id}>
                    {option.text} - Votes: {option.votes}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p>No polls available.</p>
      )}
    </div>
  );
}