'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext'; // Adjust the path as needed

export default function CreateUser() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent duplicate submissions
    setIsSubmitting(true);
    setMessage('');

    // Validate username and password
    const usernameRegex = /^[a-zA-Z0-9_]+$/; // Allow only alphanumeric and underscores
    if (!usernameRegex.test(username)) {
      setMessage('Error: Username can only contain letters, numbers, and underscores.');
      setIsSubmitting(false);
      return;
    }
    if (username.length < 3 || password.length < 6) {
      setMessage('Error: Username must be at least 3 characters and password at least 6 characters.');
      setIsSubmitting(false);
      return;
    }

    // Validate profile picture
    if (profilePicture) {
      if (profilePicture.size > 5 * 1024 * 1024) { // Max 5MB
        setMessage('Error: Profile picture must be less than 5MB.');
        setIsSubmitting(false);
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(profilePicture.type)) {
        setMessage('Error: Only JPEG, PNG, or GIF files are allowed.');
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }

      const response = await fetch('/api/users', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setMessage('User created successfully! Redirecting to homepage...');
        login(data.token, data.user, data.refreshToken); // Use AuthContext to log in
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.error || 'Unknown error occurred'}`);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Create User</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="profilePicture">Profile Picture:</label>
          <input
            id="profilePicture"
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
            disabled={isSubmitting}
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Create User'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}