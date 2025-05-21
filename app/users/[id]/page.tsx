import { prisma } from '@/lib/prisma'; // Import the singleton Prisma Client
import { notFound } from 'next/navigation';
import Image from 'next/image'; // Use Next.js's Image component for better image optimization
import { Prisma } from '@prisma/client'; // Import Prisma namespace

export default async function UserProfile({ params }: { params: Promise<{ id: string }> }) {
  // Ensure `params` is awaited before accessing its properties
  const { id } = await params;
  const userId = parseInt(id, 10);

  // Validate the user ID
  if (isNaN(userId)) {
    return <p>Invalid user ID.</p>;
  }

  try {
    // Fetch the user and their polls from the database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { polls: true },
    });

    if (!user) {
      return notFound(); // Return 404 page if the user does not exist
    }

    return (
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center' }}>{user.username}'s Profile</h1>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Image
            src={user.profileImage || '/default-profile.png'}
            alt={`${user.username}'s profile`}
            width={100}
            height={100}
            style={{ borderRadius: '50%' }}
          />
        </div>
        <h2>Polls Created:</h2>
        {user.polls.length > 0 ? (
          <ul>
            {user.polls.map((poll) => (
              <li key={poll.id} style={{ marginBottom: '10px' }}>
                {poll.question}
              </li>
            ))}
          </ul>
        ) : (
          <p>No polls created yet.</p>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error fetching user:', error);

    // Handle specific Prisma errors if needed
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return <p>A database error occurred. Please try again later.</p>;
    }

    return <p>Something went wrong. Please try again later.</p>;
  }
}