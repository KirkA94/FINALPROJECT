'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { isTokenExpired } from '@/lib/tokenUtils'; // Import token utility

// Centralized function to get a valid token
async function getValidToken() {
  try {
    let token = localStorage.getItem('token');

    if (!token || isTokenExpired(token)) {
      console.log("Token is expired or missing. Attempting to refresh...");
      token = await refreshAccessToken();
    }

    if (!token) {
      throw new Error("Unable to obtain a valid token. Please log in again.");
    }

    return token;
  } catch (error) {
    console.error("Error obtaining a valid token:", error);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login'; // Redirect to login
    throw error;
  }
}

// Function to refresh the access token
async function refreshAccessToken() {
  try {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      console.error("Refresh token not found in localStorage");
      throw new Error("Refresh token not found");
    }

    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("Failed to refresh access token:", errorResponse);
      throw new Error(errorResponse.error || "Failed to refresh access token");
    }

    const { accessToken } = await response.json();
    localStorage.setItem('token', accessToken);
    return accessToken;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error;
  }
}

export default function CreatePollPage() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']); // Default to two options
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index: number) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    // Validate inputs
    if (!question.trim()) {
      setMessage("Question cannot be empty.");
      setIsSubmitting(false);
      return;
    }

    if (options.filter((option) => option.trim()).length < 2) {
      setMessage("Please provide at least two valid options.");
      setIsSubmitting(false);
      return;
    }

    try {
      const token = await getValidToken(); // Use centralized token management

      // Decode the token to extract the userId (assuming JWT contains the userId in its payload)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.userId;

      if (!userId) {
        throw new Error("User ID is missing from the token.");
      }

      const response = await fetch('/api/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question, options, userId }), // Include userId in the request body
      });

      if (response.ok) {
        setMessage("Poll created successfully!");
        setTimeout(() => {
          router.push('/polls');
        }, 2000);
      } else if (response.status === 401) {
        setMessage("Unauthorized: Please log in again.");
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        router.push('/login');
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.error || "Unknown error occurred."}`);
      }
    } catch (error) {
      console.error("Error creating poll:", error);
      setMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Create a New Poll</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="question">Question:</label>
          <input
            id="question"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <h3>Options:</h3>
          {options.map((option, index) => (
            <div key={index}>
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                required
                disabled={isSubmitting}
              />
              {options.length > 2 && (
                <button type="button" onClick={() => handleRemoveOption(index)}>
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={handleAddOption}>
            Add Option
          </button>
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Create Poll"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}