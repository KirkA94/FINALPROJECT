import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Fetch all polls (GET method)
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
    console.error("Error fetching polls:", error);
    return NextResponse.json(
      { error: "Failed to fetch polls.", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// Create a new poll (POST method)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { question, options, userId } = body;

    // Validate input
    if (!question || typeof question !== "string" || question.trim().length === 0) {
      return NextResponse.json(
        { error: "Invalid or missing 'question' field." },
        { status: 400 }
      );
    }

    if (!options || !Array.isArray(options) || options.length === 0) {
      return NextResponse.json(
        { error: "At least one valid option is required." },
        { status: 400 }
      );
    }

    if (!userId || typeof userId !== "number") {
      return NextResponse.json(
        { error: "Invalid or missing 'userId' field." },
        { status: 400 }
      );
    }

    // Sanitize options to ensure they are all valid strings
    const sanitizedOptions = options.filter((option: string) =>
      typeof option === "string" && option.trim().length > 0
    );

    if (sanitizedOptions.length === 0) {
      return NextResponse.json(
        { error: "At least one valid option is required after sanitization." },
        { status: 400 }
      );
    }

    // Create the poll with options
    const poll = await prisma.poll.create({
      data: {
        question: question.trim(),
        userId,
        options: {
          create: sanitizedOptions.map((text: string) => ({ text: text.trim() })),
        },
      },
      include: {
        options: true, // Include options in the response
        user: true, // Include the user who created the poll
      },
    });

    return NextResponse.json(poll, { status: 201 });
  } catch (error) {
    console.error("Error creating poll:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to create poll.", details: errorMessage },
      { status: 500 }
    );
  }
}