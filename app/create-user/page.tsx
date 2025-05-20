'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateUser() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true); // Indicate that the form is being submitted
    setMessage(''); // Clear any existing messages

    try {
      // Use FormData to handle file upload
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }

      const response = await fetch('/api/users', {
        method: 'POST',
        body: formData, // Send FormData for multipart/form-data
      });

      if (response.ok) {
        const data = await response.json();
        setMessage('User created successfully! Redirecting to homepage...');
        localStorage.setItem('authToken', data.token); // Store the token
        setTimeout(() => {
          router.push('/'); // Redirect to homepage
        }, 2000);
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false); // Reset submission state
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
            disabled={isSubmitting} // Disable input during submission
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
            disabled={isSubmitting} // Disable input during submission
          />
        </div>
        <div>
          <label htmlFor="profilePicture">Profile Picture:</label>
          <input
            id="profilePicture"
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
            disabled={isSubmitting} // Disable input during submission
          />
        </div>
        <button type="submit" disabled={isSubmitting}> {/* Disable button during submission */}
          {isSubmitting ? 'Submitting...' : 'Create User'}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}