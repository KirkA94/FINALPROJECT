import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma'; // Adjust path to your Prisma client
import bcrypt from 'bcryptjs';
import { setCookie } from 'nookies'; // For managing cookies (optional)

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const username = formData.get('username') as string;
    const passwordHash = formData.get('passwordHash') as string;

    if (!username || !passwordHash) {
      return NextResponse.json(
        { error: 'Invalid input: username and password are required.' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(passwordHash, 10);

    // Create the user in the database
    const newUser = await prisma.user.create({
      data: {
        username,
        passwordHash: hashedPassword,
        profileImage: null, // Handle profileImage logic if needed
      },
    });

    // Create a session (for example, using a JWT token)
    const token = `mockTokenFor_${newUser.id}`; // Replace with real JWT logic
    setCookie({ res: NextResponse }, 'authToken', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return NextResponse.json({ message: 'User created successfully', token }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user.' },
      { status: 500 }
    );
  }
}