import 'formidable';

declare module 'formidable' {
  interface IncomingForm {
    uploadDir?: string;
    keepExtensions?: boolean;
  }
}