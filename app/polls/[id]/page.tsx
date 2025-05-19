'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type PollOption = {
  id: number;
  text: string;
  votes: { id: number; choice: string; user: { username: string } }[];
};

type Poll = {
  id: number;
  question: string;
  options: PollOption[];
  user: { username: string };
};

export default function PollPage({ params }: { params: { id: string } }) {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const res = await fetch(`/api/polls/${params.id}`);
        if (!res.ok) {
          router.push('/404'); // Redirect to 404 if poll not found
          return;
        }
        const data = await res.json();
        setPoll(data);
      } catch (error) {
        console.error('Failed to fetch poll:', error);
        setError('Failed to load poll. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [params.id, router]);

  const handleVote = async (optionId: number) => {
    try {
      const response = await fetch(`/api/polls/${params.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionId }),
      });

      if (!response.ok) {
        throw new Error('Failed to cast vote');
      }

      const updatedPoll = await response.json();
      setPoll(updatedPoll); // Refresh poll data with updated vote counts
    } catch (error) {
      console.error('Error voting:', error);
      setError('Failed to cast vote. Please try again.');
    }
  };

  if (loading) return <p>Loading poll...</p>;

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  if (!poll) return <p>Poll not found.</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>{poll.question}</h1>
      <p>Created by: {poll.user.username}</p>

      <ul>
        {poll.options.map((option) => (
          <li key={option.id} style={{ marginBottom: '20px' }}>
            <strong>{option.text}</strong> - Votes: {option.votes.length}
            <button
              style={{
                marginLeft: '10px',
                padding: '5px 10px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
              onClick={() => handleVote(option.id)}
            >
              Vote
            </button>
            <details style={{ marginTop: '10px' }}>
              <summary>See who voted</summary>
              <ul>
                {option.votes.map((vote) => (
                  <li key={vote.id}>
                    {vote.user.username} - {vote.choice}
                  </li>
                ))}
              </ul>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}