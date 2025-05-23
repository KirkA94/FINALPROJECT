import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || "fallback-access-secret";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
    const { userId } = decoded as { userId: number };

    const { question, options } = await req.json();
    if (!question || !Array.isArray(options) || options.length < 2) {
      return NextResponse.json({ error: "Invalid poll data." }, { status: 400 });
    }

    const poll = await prisma.poll.create({
      data: {
        question,
        userId,
        options: {
          create: options.map((option: string) => ({ text: option })),
        },
      },
    });

    return NextResponse.json(poll, { status: 201 });
  } catch (error) {
    console.error("Error creating poll:", error);
    return NextResponse.json({ error: "Failed to create poll." }, { status: 500 });
  }
}