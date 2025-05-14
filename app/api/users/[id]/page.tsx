import { prisma } from '@/lib/prisma'; // Import the singleton Prisma Client
import { notFound } from 'next/navigation';
import { Prisma } from '@prisma/client'; // Import Prisma namespace
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react';

export default async function UserProfile({ params }: { params: { id: string } }) {
  const userId = Number(params.id);

  // Validate the user ID
  if (isNaN(userId)) {
    return <p>Invalid user ID.</p>;
  }

  try {
    // Fetch the user and their polls
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { polls: true },
    });
    type UserWithPolls = { id: number; username: string; profileImage: string | null; polls: { id: number; question: string }[] };
    const userWithPolls = user as UserWithPolls;
    if (!user) {
      return notFound(); // Use Next.js's built-in 404 handling
    }
    if (!user) {
      notFound(); // Use Next.js's built-in 404 handling
    }

    return (
      <div style={{ padding: '20px' }}>
        <h1>{user.username}'s Profile</h1>
        <img
          src={user.profileImage || '/default-profile.png'}
          alt={`${user.username}'s profile`}
          style={{ width: '100px', height: '100px', borderRadius: '50%' }}
        />
        <h2>Polls Created:</h2>
        <ul>
            {user.polls.map((poll: { id: number; question: string }) => (
            <li key={poll.id}>{poll.question}</li>
            ))}
        </ul>
      </div>
    );
  } catch (error) {
    console.error('Error fetching user:', error);
    return <p>Something went wrong. Please try again later.</p>;
  }
}