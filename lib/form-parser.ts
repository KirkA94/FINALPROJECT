import { NextRequest } from "next/server";
import formidable, { IncomingForm } from "formidable";
import { IncomingMessage } from "http";
import { Readable } from "stream";
import { Socket } from "net";

// Mock socket for IncomingMessage
class MockSocket extends Socket {
  constructor() {
    super();
  }
}

// Adapter to convert Next.js ReadableStream to Node.js IncomingMessage
class IncomingMessageAdapter extends IncomingMessage {
  constructor(headers: Record<string, string>, body: Readable) {
    const mockSocket = new MockSocket(); // Create a mock socket
    super(mockSocket);

    this.headers = headers;
    Object.assign(this, body);
  }
}

// Function to parse form data using formidable
export async function parseForm(req: NextRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  const form = new IncomingForm({
    multiples: true, // Allow multiple file uploads
    keepExtensions: true, // Preserve file extensions
  });

  return new Promise((resolve, reject) => {
    // Read the request body as a Readable stream
    const reader = req.body?.getReader();
    const stream = new Readable({
      read() {
        reader?.read().then(({ done, value }) => {
          if (done) {
            this.push(null); // End the stream
          } else {
            this.push(Buffer.from(value));
          }
        });
      },
    });

    // Convert the Next.js request to a Node.js IncomingMessage
    const adaptedRequest = new IncomingMessageAdapter(
      {
        "content-type": req.headers.get("content-type") || "",
        "content-length": req.headers.get("content-length") || "",
      },
      stream
    );

    // Parse the adapted request with formidable
    form.parse(adaptedRequest, (err, fields, files) => {
      if (err) {
        reject(new Error(`Failed to parse form data: ${err.message}`));
      } else {
        resolve({ fields, files });
      }
    });
  });
}