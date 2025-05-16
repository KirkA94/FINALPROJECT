'use client';

import { useState, useEffect } from 'react';


type Poll = {
  id: number;
  question: string;
  options: { id: number; text: string; votes: number }[]; // Include vote counts
};

export default function Home() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(false); // Loading state for fetches
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state

  // Fetch polls on initial render
  useEffect(() => {
    const fetchPolls = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/polls');
        const data = await response.json();
        setPolls(data);
      } catch (error) {
        console.error('Failed to fetch polls:', error);
        alert('Failed to fetch polls. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();

    // Check if user is logged in by verifying token in localStorage
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

  // Handle voting for a poll option
  const handleVote = async (optionId: number) => {
    try {
      const res = await fetch('/api/polls', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ optionId }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('Error Response Text:', text);
        alert(`Error voting: ${text}`);
        return;
      }

      const updatedOption = await res.json();
      console.log('Updated Option:', updatedOption);

      // Re-fetch polls to update the UI
      const updatedPolls = await fetch('/api/polls').then((res) => res.json());
      setPolls(updatedPolls);
    } catch (error) {
      console.error('Failed to vote:', error);
      alert('Failed to vote. Please try again later.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Polls Dashboard</h1>

      {loading ? (
        <p>Loading polls...</p>
      ) : (
        <>
          {/* List of polls */}
          {polls.length > 0 ? (
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
                <h2>{poll.question}</h2>
                <ul>
                  {poll.options.map((option) => (
                    <li key={option.id} style={{ marginBottom: '10px' }}>
                      {option.text} - Votes: {option.votes}
                      <button
                        onClick={() => handleVote(option.id)}
                        style={{
                          marginLeft: '10px',
                          padding: '5px 10px',
                          cursor: 'pointer',
                        }}
                      >
                        Vote
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p>No polls available.</p>
          )}
        </>
      )}
    </div>
  );
}