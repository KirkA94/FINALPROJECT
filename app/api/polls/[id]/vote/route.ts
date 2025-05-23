import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    const pollId = parseInt(id, 10);

    if (isNaN(pollId) || pollId <= 0) {
      return NextResponse.json({ error: "Invalid poll ID. Must be a positive integer." }, { status: 400 });
    }

    const { optionId, userId, choice } = await req.json();

    if (!optionId || !userId || typeof choice === "undefined") {
      return NextResponse.json({ error: "Missing required fields: optionId, userId, or choice." }, { status: 400 });
    }

    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: { options: true },
    });

    if (!poll) {
      return NextResponse.json({ error: "Poll not found. Please check the poll ID." }, { status: 404 });
    }

    const optionExists = poll.options.some((option) => option.id === optionId);
    if (!optionExists) {
      return NextResponse.json({ error: "Option not found or does not belong to the specified poll." }, { status: 404 });
    }

    const existingVote = await prisma.vote.findFirst({
      where: { userId, pollId },
    });

    if (existingVote) {
      return NextResponse.json({ error: "User has already voted in this poll." }, { status: 403 });
    }

    await prisma.vote.create({
      data: { pollId, optionId, userId, choice },
    });

    const updatedPoll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: {
        options: {
          include: {
            votes: {
              include: {
                user: { select: { id: true, username: true } },
              },
            },
          },
        },
        user: { select: { id: true, username: true } },
      },
    });

    return NextResponse.json(updatedPoll, { status: 201 });
  } catch (error) {
    console.error("Error recording vote:", error);
    return NextResponse.json({ error: "Failed to record vote" }, { status: 500 });
  }
}