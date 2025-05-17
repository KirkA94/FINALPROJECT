'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Poll = {
  id: number;
  question: string;
  options: { id: number; text: string; votes: number }[];
};

export default function PollsDashboard() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPolls = async () => {
      setLoading(true);
      setError('');
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
    };

    fetchPolls();
  }, []);

  if (loading) return <p>Loading polls...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Polls Dashboard</h1>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : polls.length > 0 ? (
        polls.map((poll) => (
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
        ))
      ) : (
        <p>No polls available.</p>
      )}
    </div>
  );
}