import jwt, { JwtPayload } from "jsonwebtoken";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || "fallback-access-secret";
const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET || "fallback-refresh-secret";

interface TokenPayload extends JwtPayload {
  userId: number;
}

function generateAccessToken(payload: object): string {
  return jwt.sign(payload, JWT_ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
}

export async function POST(req: Request) {
  try {
    const { refreshToken } = await req.json();

    if (!refreshToken) {
      return NextResponse.json({ error: "Refresh token is required" }, { status: 400 });
    }

    const decoded = jwt.verify(refreshToken, JWT_REFRESH_TOKEN_SECRET) as TokenPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.refreshToken !== refreshToken) {
      return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
    }

    const newAccessToken = generateAccessToken({ userId: user.id, username: user.username });

    return NextResponse.json({ accessToken: newAccessToken }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to refresh token" }, { status: 500 });
  }
}