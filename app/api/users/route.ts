import { NextRequest, NextResponse } from 'next/server';
import formidable from 'formidable';
import { prisma } from '../../../lib/prisma';
import path from 'path';
import { Readable } from 'stream';
import jwt from 'jsonwebtoken'; // For JWT
import bcrypt from 'bcryptjs'; // For password hashing

export const config = {
  api: {
    bodyParser: false, // Disable Next.js's native body parsing
  },
};

// Secret key for JWT (use environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Extend the Readable type to include headers
interface ReadableWithHeaders extends Readable {
  headers: Record<string, string>;
}

// Custom function to convert a ReadableStream to a Node.js Readable
function readableFromStream(request: NextRequest): ReadableWithHeaders {
  const reader = request.body?.getReader();

  if (!reader) {
    throw new Error('Request body is null or undefined');
  }

  const stream = new Readable({
    async read() {
      const { done, value } = await reader.read();
      if (done) {
        this.push(null); // End the stream
      } else {
        this.push(value); // Push the chunk to the stream
      }
    },
  }) as ReadableWithHeaders;

  // Attach headers from NextRequest to the Readable stream
  stream.headers = Object.fromEntries(request.headers.entries()) as Record<string, string>;

  return stream;
}

// POST /api/users - Create a new user
export async function POST(req: NextRequest) {
  try {
    const reqStream = readableFromStream(req);

    const form = formidable({ uploadDir: './public/uploads', keepExtensions: true });
    const [fields, files]: [formidable.Fields, formidable.Files] = await new Promise((resolve, reject) => {
      form.parse(reqStream as any, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const { username, password } = fields;

    if (!username || !password) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Hash the password before storing
    const passwordHash = await bcrypt.hash(password.toString(), 10);

    // Handle profile picture upload
    let profilePictureUrl: string | null = null;
    if (files.profilePicture) {
      if (Array.isArray(files.profilePicture)) {
        profilePictureUrl = `/uploads/${path.basename((files.profilePicture[0] as formidable.File).filepath)}`;
      } else {
        profilePictureUrl = `/uploads/${path.basename((files.profilePicture as formidable.File).filepath)}`;
      }
    }

    const newUser = await prisma.user.create({
      data: {
        username: username.toString(),
        passwordHash,
        profileImage: profilePictureUrl,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

// POST /api/users/signin - Authenticate user and generate JWT
export async function signin(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error('Error signing in:', error);
    return NextResponse.json({ error: 'Failed to sign in', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

// POST /api/users/signout - Sign out a user
export async function signout() {
  try {
    // Invalidate token (e.g., remove it from client storage)
    return NextResponse.json({ message: 'Signed out successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error signing out:', error);
    return NextResponse.json({ error: 'Failed to sign out', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}