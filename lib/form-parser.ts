import formidable, { IncomingForm } from "formidable";
import { NextRequest } from "next/server";

export async function parseForm(req: NextRequest) {
  const form = new IncomingForm({
    multiples: true, // Allow multiple file uploads
    keepExtensions: true, // Preserve file extensions
  });

  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
    form.parse(req as any, (err, fields, files) => {
      if (err) {
        reject(new Error(`Failed to parse form data: ${err.message}`));
      } else {
        resolve({ fields, files });
      }
    });
  });
}