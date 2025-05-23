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
        // Use a relative API path since the API is hosted on the same domain
        const token = localStorage.getItem('token'); // Ensure token is included for authenticated requests
        const response = await fetch('/api/polls', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch recent polls. Please try again later.');
        }

        const data = await response.json();

        // Validate the API response
        if (!Array.isArray(data) || !data.every((poll) => typeof poll.id === 'number' && typeof poll.question === 'string')) {
          throw new Error('Unexpected response format from the server.');
        }

        // Limit to the 5 most recent polls
        setRecentPolls(data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching recent polls:', error);
        setError((error as Error).message || 'Unable to load recent polls. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPolls();
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>MyPolls</h1>
      <h5>By: Kirk Austin</h5>
      <p>Welcome to MyPolls, where you can create and participate in exciting polls!</p>

      <div style={{ margin: '20px 0' }}>
        <Button label="Enter Polls" onClick={() => handleNavigation('/polls')} bgColor="#007bff" />
        <Button label="Create User" onClick={() => handleNavigation('/create-user')} bgColor="#28a745" />
      </div>

      <AuthButtons />

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
                style={pollItemStyle}
                onClick={() => handleNavigation(`/polls/${poll.id}`)}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f1f1')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f9f9f9')}
              >
                {poll.question}
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent polls available. <a onClick={() => handleNavigation('/polls/create')} style={{ color: '#007bff', cursor: 'pointer' }}>Create one now!</a></p>
        )}
      </div>
    </div>
  );
}

// Reusable Button Component
const Button: React.FC<{ label: string; onClick: () => void; bgColor: string }> = ({ label, onClick, bgColor }) => (
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

// Poll Item Style
const pollItemStyle = {
  margin: '10px 0',
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  cursor: 'pointer',
  backgroundColor: '#f9f9f9',
  transition: 'background-color 0.3s',
};