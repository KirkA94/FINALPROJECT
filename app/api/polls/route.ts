import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Handle GET requests: Fetch all polls
export async function GET() {
  try {
    const polls = await prisma.poll.findMany();
    return NextResponse.json(polls, { status: 200 });
  } catch (error) {
    console.error('Error fetching polls:', error);
    return NextResponse.json({ error: 'Failed to fetch polls' }, { status: 500 });
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