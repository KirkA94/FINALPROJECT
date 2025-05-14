'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateUser() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('passwordHash', password);
      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }

      const response = await fetch('/api/users', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setMessage('User created successfully! Redirecting to polls...');
        setTimeout(() => {
          router.push('/polls');
        }, 2000);
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.error}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage('An unknown error occurred.');
      }
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
          />
        </div>
        <div>
          <label htmlFor="profilePicture">Profile Picture:</label>
          <input
            id="profilePicture"
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
          />
        </div>
        <button type="submit">Create User</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}