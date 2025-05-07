import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function UserProfile({ params }: { params: { id: string } }) {
  const userId = Number(params.id);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { polls: true },
  }) as { 
    username: string; 
    profileImage: string; 
    polls: { id: number; question: string }[] 
  } | null;

  if (!user) {
    return <p>User not found.</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>{user.username}'s Profile</h1>
      <img
        src={user.profileImage}
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
}