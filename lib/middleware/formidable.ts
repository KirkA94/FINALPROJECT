import { IncomingForm } from 'formidable';
import { NextApiRequest, NextApiResponse } from 'next';
import { promisify } from 'util';

// Disable body parsing by Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

// Promisify the formidable form.parse function for easier use
const parseForm = promisify((req: NextApiRequest, cb: (err: any, fields: any, files: any) => void) => {
  const form = new IncomingForm();
  form.parse(req, cb);
});

export async function parseMultipartForm(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { fields, files } = await parseForm(req);
    return { fields, files };
  } catch (error) {
    res.status(500).json({ error: 'Error parsing form data' });
    throw error;
  }
}