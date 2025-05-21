import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    // Await params
    const { id } = context.params;
    const pollId = parseInt(id, 10);

    // Validate poll ID
    if (isNaN(pollId)) {
      return NextResponse.json({ error: "Invalid poll ID" }, { status: 400 });
    }

    // Fetch the poll from the database
    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: {
        options: {
          include: { votes: true },
        },
        user: true,
      },
    });

    if (!poll) {
      return NextResponse.json({ error: "Poll not found" }, { status: 404 });
    }

    return NextResponse.json(poll, { status: 200 });
  } catch (error) {
    console.error("Error fetching poll:", error);
    return NextResponse.json(
      { error: "Failed to fetch poll. Please try again later." },
      { status: 500 }
    );
  }
}