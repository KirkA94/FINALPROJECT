import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma'; // Adjust the path to your Prisma client

export async function GET(req: Request, context: { params: { id: string } }) {
  try {
    // Await the params object before destructuring
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: 'Poll ID is required' }, { status: 400 });
    }

    const pollId = parseInt(id, 10);

    if (isNaN(pollId)) {
      return NextResponse.json({ error: 'Invalid poll ID' }, { status: 400 });
    }

    // Fetch the poll with options, votes, and associated user details
    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: {
        options: {
          include: {
            votes: {
              include: {
                user: true, // Include user details for each vote
              },
            },
          },
        },
        user: true, // Include poll creator details
      },
    });

    if (!poll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }

    return NextResponse.json(poll, { status: 200 });
  } catch (error) {
    console.error('Error fetching poll:', error);
    return NextResponse.json({ error: 'Failed to fetch poll' }, { status: 500 });
  }
}