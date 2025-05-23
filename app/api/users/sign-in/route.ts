import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;
const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET;

function generateAccessToken(payload: object): string {
  return jwt.sign(payload, JWT_ACCESS_TOKEN_SECRET as string, { expiresIn: "1h" });
}

function generateRefreshToken(payload: object): string {
  return jwt.sign(payload, JWT_REFRESH_TOKEN_SECRET as string, { expiresIn: "7d" });
}

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    const accessToken = generateAccessToken({ userId: user.id, username: user.username });
    const refreshToken = generateRefreshToken({ userId: user.id });

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return NextResponse.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to sign in" }, { status: 500 });
  }
}