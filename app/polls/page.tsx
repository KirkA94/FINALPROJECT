'use client';

import { useState, useEffect } from 'react';

type Poll = {
  id: number;
  question: string;
  options: { id: number; text: string }[]; // Updated to handle options as objects
};

export default function Home() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
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

  // Add a new option input field for creating polls
  const addOption = () => {
    setOptions([...options, '']);
  };

  // Update the value of an existing option
  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  // Handle form submission to create a new poll
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim() || options.some((option) => !option.trim())) {
      alert('Please fill in the question and all options.');
      return;
    }

    try {
      const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage
      if (!token) {
        alert('You must be signed in to create a poll.');
        return;
      }

      const res = await fetch('/api/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify({ question, options }),
      });

      // Log the raw response to debug
      console.log('Raw Response:', res);

      if (!res.ok) {
        const text = await res.text(); // Read the raw text response for debugging
        console.error('Error Response Text:', text);
        alert(`Error creating poll: ${text}`);
        return;
      }

      const data = await res.json();
      console.log('Response Data:', data);

      setQuestion('');
      setOptions(['', '']);
      // Re-fetch polls after creating a new one
      const updatedPolls = await fetch('/api/polls').then((res) => res.json());
      setPolls(updatedPolls);
    } catch (error) {
      console.error('Failed to create poll:', error);
      alert('Failed to create poll. Please try again later.');
    }
  };

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove token from localStorage
    setIsLoggedIn(false); // Update login state
    alert('You have been logged out.');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Polls Dashboard</h1>

      {isLoggedIn ? (
        <button
          onClick={handleLogout}
          style={{
            marginBottom: '20px',
            padding: '10px 15px',
            cursor: 'pointer',
          }}
        >
          Log Out
        </button>
      ) : (
        <p>You are not logged in. Please log in to create polls.</p>
      )}

      {/* Form for creating a new poll */}
      {isLoggedIn && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
          <div>
            <label htmlFor="question">Poll Question:</label>
            <input
              id="question"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
            />
          </div>

          <div>
            <label>Poll Options:</label>
            {options.map((option, index) => (
              <input
                key={index}
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
              />
            ))}
            <button
              type="button"
              onClick={addOption}
              style={{
                marginTop: '10px',
                padding: '8px 12px',
                cursor: 'pointer',
              }}
            >
              Add Option
            </button>
          </div>

          <button
            type="submit"
            style={{
              marginTop: '20px',
              padding: '10px 15px',
              cursor: 'pointer',
            }}
          >
            Create Poll
          </button>
        </form>
      )}

      {/* Loading State */}
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
                    <li key={option.id}>{option.text}</li>
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