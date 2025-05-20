import { NextRequest } from "next/server";
import { IncomingForm } from "formidable";
import { IncomingMessage } from "http";
import { Readable } from "stream";

// Create a class that extends IncomingMessage
class IncomingMessageAdapter extends IncomingMessage {
  constructor(headers: Record<string, string>, body: ArrayBuffer | null) {
    super(null as any); // Pass `null` as the socket, as it's not used in this context
    this.headers = headers;

    if (body) {
      const readable = new Readable();
      readable._read = () => {}; // No-op
      readable.push(Buffer.from(body)); // Push the ArrayBuffer as a Buffer
      readable.push(null); // End of stream
      Object.assign(this, readable);
    }
  }
}

// Parse form data from NextRequest
export const parseForm = (req: NextRequest): Promise<{ fields: any; files: any }> => {
  const form = new IncomingForm({
    multiples: false, // Single file uploads
    keepExtensions: true, // Preserve file extensions
  });

  return new Promise((resolve, reject) => {
    try {
      // Read the request body as an ArrayBuffer
      req.body
        ?.getReader()
        .read()
        .then(({ value }) => {
          const body = value ? new Uint8Array(value).buffer : null; // Convert Uint8Array to ArrayBuffer

          // Create an adapter for IncomingMessage
          const reqAdapter = new IncomingMessageAdapter(
            {
              "content-type": req.headers.get("content-type") || "",
              "content-length": req.headers.get("content-length") || "0",
            },
            body
          );

          // Parse the form using Formidable
          form.parse(reqAdapter, (err, fields, files) => {
            if (err) {
              reject(new Error(`Failed to parse form data: ${err.message}`));
            } else {
              resolve({ fields, files });
            }
          });
        })
        .catch((err) => {
          reject(new Error(`Failed to read request body: ${err.message}`));
        });
    } catch (error) {
      reject(new Error("Failed to process the request stream."));
    }
  });
};