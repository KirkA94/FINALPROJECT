'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthButtons from './components/AuthButtons';

type Poll = {
  id: number;
  question: string;
};

export default function Home() {
  const [recentPolls, setRecentPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Fetch the most recent polls on mount
  useEffect(() => {
    const fetchRecentPolls = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('/api/polls');
        if (!response.ok) {
          throw new Error('Failed to fetch recent polls.');
        }
        const data = await response.json();
        // Limit to the 5 most recent polls
        setRecentPolls(data.slice(0, 5));
      } catch (error) {
        console.error(error);
        setError('Unable to load recent polls. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPolls();
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>MyPolls</h1>
      <h5>By: Kirk Austin</h5>
      <p>Welcome to MyPolls, where you can create and participate in exciting polls!</p>
      
      <div style={{ margin: '20px 0' }}>
        <button
          onClick={() => router.push('/polls')}
          style={{
            margin: '10px',
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Enter Polls
        </button>

        <button
          onClick={() => router.push('/create-user')}
          style={{
            margin: '10px',
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Create User
        </button>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h2>Most Recent Polls</h2>
        {loading ? (
          <p>Loading recent polls...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : recentPolls.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {recentPolls.map((poll) => (
              <li
                key={poll.id}
                style={{
                  margin: '10px 0',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
                onClick={() => router.push(`/polls/${poll.id}`)}
              >
                {poll.question}
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent polls available.</p>
        )}
      </div>
    </div>
  );
}