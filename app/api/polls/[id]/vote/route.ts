import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Resolve the params object
    const { id } = await context.params;
    const pollId = parseInt(id, 10);

    // Validate poll ID
    if (isNaN(pollId) || pollId <= 0) {
      return NextResponse.json(
        { error: "Invalid poll ID. Must be a positive integer." },
        { status: 400 }
      );
    }

    // Parse the request body
    const body = await req.json();
    const { optionId, userId, choice } = body;

    // Validate the request body
    if (!optionId || !userId || !choice) {
      return NextResponse.json(
        { error: "Missing required fields: optionId, userId, or choice." },
        { status: 400 }
      );
    }

    // Check if the poll and option exist
    const pollExists = await prisma.poll.findUnique({
      where: { id: pollId },
    });

    if (!pollExists) {
      return NextResponse.json(
        { error: "Poll not found. Please check the poll ID." },
        { status: 404 }
      );
    }

    const optionExists = await prisma.option.findUnique({
      where: { id: optionId },
    });

    if (!optionExists) {
      return NextResponse.json(
        { error: "Option not found. Please check the option ID." },
        { status: 404 }
      );
    }

    // Check if the user has already voted in this poll
    const existingVote = await prisma.vote.findFirst({
      where: { userId, pollId },
    });

    if (existingVote) {
      return NextResponse.json(
        { error: "User has already voted in this poll." },
        { status: 403 }
      );
    }

    // Record the vote
    const vote = await prisma.vote.create({
      data: {
        pollId,
        optionId,
        userId,
        choice,
      },
    });

    // Fetch the updated poll with votes and associated user data
    const updatedPoll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: {
        options: {
          include: {
            votes: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return NextResponse.json(updatedPoll, { status: 201 });
  } catch (error) {
    console.error("Error recording vote:", error);

    // Return a detailed error response
    return NextResponse.json(
      {
        error: "Failed to record vote",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}