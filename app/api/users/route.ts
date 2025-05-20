import { NextRequest, NextResponse } from "next/server";
import { parseForm } from "@/lib/formidable-helper"; // Use the helper function
import { prisma } from "@/lib/prisma"; // Adjust the import path for Prisma
import bcrypt from "bcryptjs";
import { promises as fs } from "fs";

export const config = {
  api: {
    bodyParser: false, // Disable default body parser to allow Formidable to parse the request
  },
};

export async function POST(req: NextRequest) {
  try {
    // Parse the incoming form data using the helper function
    const { fields, files } = await parseForm(req);

    const { username, password } = fields;
    const profilePicture = files?.profilePicture;

    // Validate required fields
    if (!username || !password) {
      return NextResponse.json(
        { message: "Missing required fields: username or password." },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({ where: { username: String(username) } });
    if (existingUser) {
      return NextResponse.json(
        { message: "Username already exists." },
        { status: 409 }
      );
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(String(password), 10);

    // Handle profile picture upload
    let profileImageUrl = null;
    if (profilePicture) {
      const file = Array.isArray(profilePicture) ? profilePicture[0] : profilePicture;
      if (file?.filepath && file?.originalFilename) {
        const newFilename = `${Date.now()}-${file.originalFilename}`;
        const uploadPath = `./public/uploads/${newFilename}`;
        await fs.mkdir('./public/uploads', { recursive: true }); // Ensure the uploads directory exists
        await fs.rename(file.filepath, uploadPath); // Move file to uploads directory
        profileImageUrl = `/uploads/${newFilename}`; // Public URL for the file
      }
    }

    // Create the user in the database
    const newUser = await prisma.user.create({
      data: {
        username: String(username),
        passwordHash: hashedPassword,
        profileImage: profileImageUrl,
      },
    });

    // Return success response without exposing sensitive data
    return NextResponse.json(
      {
        message: "User created successfully.",
        user: {
          id: newUser.id,
          username: newUser.username,
          profileImage: newUser.profileImage,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);

    // Return a detailed error response
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred.";
    return NextResponse.json(
      { message: "Internal server error.", error: errorMessage },
      { status: 500 }
    );
  }
}