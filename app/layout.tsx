import './globals.css'; // Import global styles
import Link from 'next/link';
import { AuthProvider } from './context/AuthContext';
import AuthButtons from './components/AuthButtons'; // Import AuthButtons
import FallbackImage from './components/FallbackImage'; // Import FallbackImage
import './styles/dashboard.css';

export const metadata = {
  title: 'MyPolls By Kirk Austin',
  description: 'Create and participate in polls easily!',
  metadataBase: new URL('https://mypolls.example.com'), // Explicitly set metadataBase
  openGraph: {
    title: 'MyPolls By Kirk Austin',
    description: 'Create and participate in polls easily!',
    images: ['/logo.png'], // Ensure images are correct
    url: 'https://mypolls.example.com', // Update with your app's URL
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
        <AuthProvider>
          <header className="header">
            <Link href="/" aria-label="MyPolls Home">
              <div className="header-logo">
                <FallbackImage
                  src="/logo.png"
                  alt="MyPolls Logo"
                  width={50}
                  height={50}
                />
                <span className="header-title">MyPolls</span>
              </div>
            </Link>
            <AuthButtons />
          </header>

          <main className="main-content">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}