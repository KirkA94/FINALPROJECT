import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma'; // Use the singleton

// Handle GET requests: Fetch user and their polls
export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = Number(url.searchParams.get('id'));

  if (isNaN(userId)) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { polls: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      username: user.username,
      profileImage: user.profileImage,
      polls: user.polls,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Handle POST requests: Create a new poll
export async function POST(req: Request) {
  try {
    const { question, options } = await req.json();
    if (!question || !options || !Array.isArray(options)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const newPoll = await prisma.poll.create({
      data: {
        question,
        options,
      },
    });
    return NextResponse.json(newPoll, { status: 201 });
  } catch (error) {
    console.error('Error creating poll:', error);
    return NextResponse.json({ error: 'Failed to create poll' }, { status: 500 });
  }
}

// Handle PUT requests: Update poll votes
export async function PUT(req: Request) {
  try {
    const { id, votes } = await req.json();
    if (!id || !votes || typeof votes !== 'object') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const updatedPoll = await prisma.poll.update({
      where: { id },
      data: { votes },
    });
    return NextResponse.json(updatedPoll, { status: 200 });
  } catch (error) {
    console.error('Error updating poll:', error);
    return NextResponse.json({ error: 'Failed to update poll' }, { status: 500 });
  }
}