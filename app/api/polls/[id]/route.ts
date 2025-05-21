import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, context: { params: { id: string } }) {
  try {
    // Await context.params to ensure proper handling of dynamic parameters
    const { id } = await context.params;
    const pollId = parseInt(id, 10);

    if (isNaN(pollId)) {
      return NextResponse.json({ error: "Invalid poll ID" }, { status: 400 });
    }

    // Fetch the poll from the database
    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: {
        options: {
          include: {
            votes: true, // Include votes for each option
          },
        },
        user: true, // Include the user who created the poll
      },
    });

    if (!poll) {
      return NextResponse.json({ error: "Poll not found" }, { status: 404 });
    }

    return NextResponse.json(poll, { status: 200 });
  } catch (err) {
    console.error("Error fetching poll:", err);
    return NextResponse.json({ error: "Failed to fetch poll" }, { status: 500 });
  }
}