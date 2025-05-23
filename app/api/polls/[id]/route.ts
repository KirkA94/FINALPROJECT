import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || "fallback-access-secret";

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    const pollId = parseInt(id, 10);

    if (isNaN(pollId)) {
      return NextResponse.json({ error: "Invalid poll ID." }, { status: 400 });
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);

    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: {
        options: { include: { votes: true } },
        user: true,
      },
    });

    if (!poll) {
      return NextResponse.json({ error: `Poll with ID ${pollId} not found.` }, { status: 404 });
    }

    return NextResponse.json(poll, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch poll." }, { status: 500 });
  }
}