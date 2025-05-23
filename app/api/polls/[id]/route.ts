import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || "fallback-access-secret";

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params; // Extract poll ID
    const pollId = parseInt(id, 10); // Convert to integer

    // Validate poll ID
    if (isNaN(pollId)) {
      return NextResponse.json({ error: "Invalid poll ID." }, { status: 400 });
    }

    // Authentication check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    try {
      jwt.verify(token, JWT_ACCESS_TOKEN_SECRET); // Verify token
    } catch (error) {
      return NextResponse.json({ error: "Invalid or expired token." }, { status: 401 });
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
      return NextResponse.json({ error: `Poll with ID ${pollId} not found.` }, { status: 404 });
    }

    // Return the poll data
    return NextResponse.json(poll, { status: 200 });
  } catch (error) {
    console.error("Error fetching poll:", error);
    return NextResponse.json({ error: "Failed to fetch poll." }, { status: 500 });
  }
}