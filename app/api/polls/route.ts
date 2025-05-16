import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma'; // Adjust the path to your Prisma client

export async function POST(req: Request) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized: Please sign in to create a poll.' },
        { status: 401 }
      );
    }

    // Mock parsing of the token to get userId (replace with actual token parsing logic)
    const userId = parseInt(token.split('_')[1]); // Example: mockTokenFor_1 -> userId = 1

    const { question, options } = await req.json();

    if (!question || !options || !Array.isArray(options)) {
      return NextResponse.json(
        { error: 'Invalid input: question and options are required.' },
        { status: 400 }
      );
    }

    const newPoll = await prisma.poll.create({
      data: {
        question,
        options: {
          create: options.map((option: string) => ({
            text: option,
          })),
        },
        user: {
          connect: { id: userId },
        },
      },
    });

    return NextResponse.json(newPoll, { status: 201 });
  } catch (error) {
    console.error('Error creating poll:', error);
    return NextResponse.json(
      { error: 'Failed to create poll.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const polls = await prisma.poll.findMany({
      include: {
        options: true,
      },
    });

    return NextResponse.json(polls, { status: 200 });
  } catch (error) {
    console.error('Error fetching polls:', error);
    return NextResponse.json(
      { error: 'Failed to fetch polls.' },
      { status: 500 }
    );
  }
}