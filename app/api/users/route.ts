import { NextRequest, NextResponse } from 'next/server';
import formidable from 'formidable';
import { prisma } from '../../../lib/prisma';
import path from 'path';
import { Readable } from 'stream';

export const config = {
  api: {
    bodyParser: false, // Disable Next.js's native body parsing
  },
};

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

export async function POST(req: NextRequest) {
  try {
    // Convert the Web ReadableStream into a Node.js Readable stream
    const reqStream = readableFromStream(req);

    const form = formidable({ uploadDir: './public/uploads', keepExtensions: true });

    const [fields, files]: [formidable.Fields, formidable.Files] = await new Promise((resolve, reject) => {
      // Pass the stream and headers to formidable
      form.parse(reqStream as any, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // Extract fields
    const { username, passwordHash } = fields;

    // Handle profile picture upload
    let profilePictureUrl: string | null = null;
    if (files.profilePicture) {
      if (Array.isArray(files.profilePicture)) {
        profilePictureUrl = `/uploads/${path.basename((files.profilePicture[0] as formidable.File).filepath)}`;
      } else {
        profilePictureUrl = `/uploads/${path.basename((files.profilePicture as formidable.File).filepath)}`;
      }
    }

    // Validate input
    if (!username || !passwordHash) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Create the user in the database
    const newUser = await prisma.user.create({
      data: {
        username: username.toString(),
        passwordHash: passwordHash.toString(),
        profileImage: profilePictureUrl,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}