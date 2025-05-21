import './globals.css'; // Global styles
import { AuthProvider } from './context/AuthContext'; // Authentication context provider
import Header from './components/header'; // Reusable header component
import Link from 'next/link'; // Next.js Link for client-side navigation
import './styles/dashboard.css'; // Specific styles for the dashboard

export const metadata = {
  title: 'MyPolls By Kirk Austin',
  description: 'Create and participate in polls easily!',
  metadataBase: new URL('https://mypolls.example.com'), // Base URL for metadata
  openGraph: {
    title: 'MyPolls By Kirk Austin',
    description: 'Create and participate in polls easily!',
    images: ['/logo.png'], // Ensure the logo path is valid
    url: 'https://mypolls.example.com', // Your app's live URL
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
        {/* SEO and Open Graph Meta Tags */}
        <meta name="description" content={metadata.description} />
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:image" content={metadata.openGraph.images[0]} />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{metadata.title}</title>
      </head>
      <body>
        {/* Auth Context Provider */}
        <AuthProvider>
          {/* Header Section */}
          <Header />

          {/* Main Content Section */}
          <main className="main-content">{children}</main>

          {/* Footer Section */}
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
      </body>
    </html>
  );
}