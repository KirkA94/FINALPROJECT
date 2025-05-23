import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import formidable, { Fields, Files } from "formidable";
import { Readable } from "stream";
import { IncomingMessage } from "http";

const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";

// Disable Next.js's default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to adapt NextRequest to a format formidable can handle
const adaptNextRequest = async (req: NextRequest): Promise<IncomingMessage> => {
  const readable = new Readable() as IncomingMessage; // Type as IncomingMessage
  readable._read = () => {}; // No-op

  // Convert ArrayBuffer to Buffer before pushing
  const buffer = Buffer.from(await req.arrayBuffer());
  readable.push(buffer); // Push the buffer content
  readable.push(null); // Signal the end of the stream

  // Add required IncomingMessage properties
  readable.headers = Object.fromEntries(req.headers); // Pass headers from NextRequest
  readable.method = req.method || "POST";
  readable.url = req.url || "";
  return readable;
};

// Helper function to parse the form data
const parseForm = async (req: NextRequest): Promise<{ fields: Fields; files: Files }> => {
  const adaptedReq = await adaptNextRequest(req); // Adapt the request
  const form = formidable({ multiples: true });
  return new Promise((resolve, reject) => {
    form.parse(adaptedReq, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

export async function POST(req: NextRequest) {
  try {
    // Parse form data using the helper function
    const { fields, files } = await parseForm(req);

    // Extract fields and files
    const username = Array.isArray(fields.username) ? fields.username[0] : fields.username;
    const password = Array.isArray(fields.password) ? fields.password[0] : fields.password;

    // Extract the profilePicture file
    const profilePicture = files.profilePicture as formidable.File | formidable.File[] | undefined;
    const profileImage =
      profilePicture && !Array.isArray(profilePicture) ? profilePicture.filepath : null;

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 }
      );
    }

    if (username.length < 3 || password.length < 6) {
      return NextResponse.json(
        { error: "Username must be at least 3 characters and password at least 6 characters." },
        { status: 400 }
      );
    }

    // Check if the username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exists." },
        { status: 400 }
      );
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        username,
        passwordHash,
        profileImage, // Save the file path or process it further if needed
      },
    });

    // Generate a JWT token
    const token = jwt.sign(
      { userId: newUser.id, username: newUser.username },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    return NextResponse.json(
      { message: "User created successfully.", user: newUser, token },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}