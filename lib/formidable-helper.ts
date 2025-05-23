import { NextRequest } from "next/server";
import formidable, { IncomingForm } from "formidable";
import { IncomingMessage } from "http";
import { Readable } from "stream";

class IncomingMessageAdapter extends IncomingMessage {
  constructor(headers: Record<string, string>, body: ArrayBuffer | null) {
    super({} as any); // Mocked Socket to satisfy the constructor
    this.headers = headers;

    if (body) {
      const readable = new Readable();
      readable._read = () => {};
      readable.push(Buffer.from(body));
      readable.push(null);
      Object.assign(this, readable);
    }
  }
}

export const parseForm = (
  req: NextRequest
): Promise<{ fields: Record<string, unknown>; files: formidable.Files }> => {
  const form = new IncomingForm({
    multiples: false,
    keepExtensions: true,
  });

  return new Promise((resolve, reject) => {
    req.body
      ?.getReader()
      .read()
      .then(({ value }) => {
        const body = value ? new Uint8Array(value).buffer : null;

        const reqAdapter = new IncomingMessageAdapter(
          {
            "content-type": req.headers.get("content-type") || "",
            "content-length": req.headers.get("content-length") || "0",
          },
          body
        );

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
  });
};