import './globals.css';
import { AuthProvider } from './context/AuthContext';
import Header from './components/header';
import Link from 'next/link';
import ErrorBoundary from './components/ErrorBoundary';

export const metadata = {
  title: 'MyPolls By Kirk Austin',
  description: 'Create and participate in polls easily!',
  metadataBase: new URL('https://mypolls.example.com'),
  openGraph: {
    title: 'MyPolls By Kirk Austin',
    description: 'Create and participate in polls easily!',
    images: ['/logo.png'],
    url: 'https://mypolls.example.com',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="description" content={metadata.description} />
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:image" content={metadata.openGraph.images[0]} />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{metadata.title}</title>
      </head>
      <body>
        <ErrorBoundary>
          <AuthProvider>
            <Header />
            <main className="main-content">{children}</main>
            <footer className="footer">
              <p>&copy; {new Date().getFullYear()} MyPolls by Kirk Austin. All rights reserved.</p>
              <nav className="footer-nav">
                <Link href="/privacy-policy" className="footer-link">
                  Privacy Policy
                </Link>
                <Link href="/terms-of-service" className="footer-link">
                  Terms of Service
                </Link>
              </nav>
            </footer>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}