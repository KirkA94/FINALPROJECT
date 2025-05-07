'use client';

import { useState, useEffect } from 'react';

type Poll = {
  id: number;
  question: string;
  options: string[];
};

export default function Home() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);

  // Fetch polls on initial render
  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await fetch('/api/polls');
        const data = await response.json();
        setPolls(data);
      } catch (error) {
        console.error('Failed to fetch polls:', error);
      }
    };

    fetchPolls();
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
      const res = await fetch('/api/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question, options }),
      });

      if (res.ok) {
        setQuestion('');
        setOptions(['', '']);
        // Re-fetch polls after creating a new one
        const updatedPolls = await fetch('/api/polls').then((res) => res.json());
        setPolls(updatedPolls);
      }
    } catch (error) {
      console.error('Failed to create poll:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Polls Dashboard</h1>

      {/* Form for creating a new poll */}
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
            style={{ marginTop: '10px' }}
          >
            Add Option
          </button>
        </div>

        <button type="submit" style={{ marginTop: '20px' }}>
          Create Poll
        </button>
      </form>

      {/* List of polls */}
      {polls.length > 0 ? (
        polls.map((poll) => (
          <div key={poll.id} style={{ marginBottom: '20px' }}>
            <h2>{poll.question}</h2>
            {poll.options.map((option, index) => (
              <div key={index}>
                <span>{option}</span>
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>No polls available.</p>
      )}
    </div>
  );
}