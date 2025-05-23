import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth"; // Import the function to verify tokens

// Create a new poll (POST method)
export async function POST(req: NextRequest) {
  try {
    // Extract and verify the token from the Authorization header
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (!token) {
      console.error("Unauthorized request: Missing token");
      return NextResponse.json(
        { error: "Unauthorized. Missing token." },
        { status: 401 }
      );
    }

    const user = verifyToken(token);
    if (!user || typeof user !== "object" || !("id" in user)) {
      console.error("Unauthorized request: Invalid or expired token", token);
      return NextResponse.json(
        { error: "Unauthorized. Invalid or expired token." },
        { status: 401 }
      );
    }

    // Parse and validate the request body
    const body = await req.json();
    const { question, options } = body;

    if (!question || typeof question !== "string" || question.trim().length === 0) {
      console.error("Invalid request: Missing or invalid 'question' field");
      return NextResponse.json(
        { error: "Invalid or missing 'question' field." },
        { status: 400 }
      );
    }

    if (!options || !Array.isArray(options) || options.length < 2) {
      console.error("Invalid request: At least two valid options are required");
      return NextResponse.json(
        { error: "At least two valid options are required." },
        { status: 400 }
      );
    }

    // Sanitize options to ensure they are all valid strings
    const sanitizedOptions = options
      .filter((option: string) => typeof option === "string" && option.trim().length > 0)
      .map((text: string) => ({ text: text.trim() }));

    if (sanitizedOptions.length < 2) {
      console.error("Invalid request: Options sanitization resulted in less than two valid options");
      return NextResponse.json(
        { error: "At least two valid options are required after sanitization." },
        { status: 400 }
      );
    }

    // Create the poll with options
    const poll = await prisma.poll.create({
      data: {
        question: question.trim(),
        userId: user.id, // Use the authenticated user's ID
        options: {
          create: sanitizedOptions,
        },
      },
      include: {
        options: true, // Include options in the response
        user: true, // Include the user who created the poll
      },
    });

    console.log("Poll created successfully:", poll);
    return NextResponse.json(poll, { status: 201 });
  } catch (error) {
    console.error("Error creating poll:", error);
    return NextResponse.json(
      { error: "Failed to create poll.", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// Optional: Add a GET route to fetch all polls if required
export async function GET() {
  try {
    const polls = await prisma.poll.findMany({
      include: {
        options: {
          include: { votes: true }, // Include votes for each option
        },
        user: true, // Include the user who created the poll
      },
    });

    console.log("Fetched polls successfully:", polls);
    return NextResponse.json(polls, { status: 200 });
  } catch (error) {
    console.error("Error fetching polls:", error);
    return NextResponse.json(
      { error: "Failed to fetch polls.", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}