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
        router.push('/404'); // Redirect to 404 on error
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [params.id, router]);

  if (loading) return <p>Loading poll...</p>;

  if (!poll) return <p>Poll not found.</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>{poll.question}</h1>
      <p>Created by: {poll.user.username}</p>

      <ul>
        {poll.options.map((option) => (
          <li key={option.id} style={{ marginBottom: '20px' }}>
            <strong>{option.text}</strong> - Votes: {option.votes.length}
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