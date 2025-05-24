import formidable, { IncomingForm, Fields, Files } from 'formidable';
import { NextApiRequest } from 'next';

// Disable Next.js body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

// Parse multipart form data
export async function parseMultipartForm(req: NextApiRequest): Promise<{ fields: Fields; files: Files }> {
  const form = new IncomingForm({
    multiples: true, // Allow multiple file uploads
    keepExtensions: true, // Preserve file extensions
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err); // Reject with error if parsing fails
      } else {
        resolve({ fields, files }); // Resolve with fields and files as an object
      }
    });
  });
}