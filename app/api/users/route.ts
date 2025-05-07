import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const formData = await req.formData();
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const profileImage = formData.get('profileImage') as File;

  if (!username || !password || !profileImage) {
    return NextResponse.json(
      { message: 'All fields are required.' },
      { status: 400 }
    );
  }

  // Save the profile image to the "public/uploads" folder
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadsDir, { recursive: true });
  const imagePath = path.join(uploadsDir, profileImage.name);
  const imageBuffer = Buffer.from(await profileImage.arrayBuffer());
  await fs.writeFile(imagePath, imageBuffer);

  // Save the user to the database
  try {
    const newUser = await prisma.user.create({
      data: {
        username,
        password, // Note: Store passwords securely in a real app!
        profileImage: `/uploads/${profileImage.name}`,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { message: 'Failed to create user.' },
      { status: 500 }
    );
  }
}