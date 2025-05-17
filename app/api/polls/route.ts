import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const polls = await prisma.poll.findMany({
      include: {
        options: {
          include: {
            votes: true, // Include votes for each option
          },
        },
        user: true, // Include the user who created the poll
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