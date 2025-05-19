import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { IncomingForm, Fields, Files, File } from 'formidable';
import { promises as fs } from 'fs';
import { IncomingMessage } from 'http';
import { Readable } from 'stream';

// Use the Node.js runtime
export const runtime = 'nodejs';

// Disable body parsing by Next.js since formidable will handle it
export const config = {
  api: {
    bodyParser: false,
  },
};

// Extend the IncomingForm type to include missing properties
declare module 'formidable' {
  interface IncomingForm {
    uploadDir?: string;
    keepExtensions?: boolean;
    parse(
      req: IncomingMessage,
      callback: (err: Error | null, fields: Fields, files: Files) => void
    ): void;
  }
}

// Helper function to simulate an IncomingMessage from the Next.js Request object
const toIncomingMessage = async (req: Request): Promise<IncomingMessage> => {
  const body = await req.arrayBuffer();
  const stream = new Readable();
  stream._read = () => {};
  stream.push(Buffer.from(body));
  stream.push(null);

  // Simulate the IncomingMessage with required properties
  const nodeReq: Partial<IncomingMessage> = Object.assign(stream, {
    method: req.method,
    headers: Object.fromEntries(req.headers.entries()),
    url: req.url || '/',
    aborted: false,
    httpVersion: '1.1',
    httpVersionMajor: 1,
    httpVersionMinor: 1,
    complete: true,
    // Mock properties
    connection: null,
    socket: null,
    rawHeaders: [],
    trailers: {},
    rawTrailers: [],
    destroy: (error?: Error) => stream.destroy(error),
  });

  return nodeReq as IncomingMessage;
};

// Helper function to parse form data using formidable
const parseForm = async (req: Request): Promise<{ fields: Fields; files: Files }> => {
  const nodeReq = await toIncomingMessage(req);
  const form = new IncomingForm() as IncomingForm & { uploadDir?: string; keepExtensions?: boolean };
  form.uploadDir = './public/uploads'; // Temporary file storage
  form.keepExtensions = true; // Keep file extensions

  // Ensure the upload directory exists
  await fs.mkdir(form.uploadDir, { recursive: true });

  // Parse the form
  return new Promise((resolve, reject) => {
    form.parse(nodeReq as IncomingMessage, (err: Error | null, fields: Fields, files: Files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};

// Named export for POST method
export const POST = async (req: Request) => {
  try {
    // Parse the form data
    const { fields, files } = await parseForm(req);

    // Extract username and password
    const username = Array.isArray(fields.username) ? fields.username[0] : fields.username;
    const password = Array.isArray(fields.password) ? fields.password[0] : fields.password;

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required.' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Handle the uploaded profile picture
    let profileImageUrl = null;
    const profilePicture = files.profilePicture as File | File[] | undefined;

    if (profilePicture) {
      const file = Array.isArray(profilePicture) ? profilePicture[0] : profilePicture;

      if (file?.filepath && file?.originalFilename) {
        const newFilename = `${Date.now()}-${file.originalFilename}`;
        const uploadPath = `./public/uploads/${newFilename}`;
        await fs.rename(file.filepath, uploadPath); // Move file to uploads directory
        profileImageUrl = `/uploads/${newFilename}`; // Public URL for the file
      }
    }

    // Create the user in the database
    const newUser = await prisma.user.create({
      data: {
        username,
        passwordHash: hashedPassword,
        profileImage: profileImageUrl,
      },
    });

    const token = `mockTokenFor_${newUser.id}`; // Replace with real JWT logic
    return NextResponse.json({ message: 'User created successfully', token });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user.' }, { status: 500 });
  }
};