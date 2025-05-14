import './globals.css'; // Import global styles
import Image from 'next/image';
import Link from 'next/link';
import { AuthProvider } from './context/AuthContext';
import AuthButtons from './components/AuthButtons'; // Import AuthButtons

export const metadata = {
  title: 'MyPolls By Kirk Austin',
  description: 'Create and participate in polls easily!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {/* Header with logo */}
          <header
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 20px',
              borderBottom: '1px solid #ddd',
            }}
          >
            <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
              <Image
                src="/logo.png" // Path to your logo in the public directory
                alt="MyPolls Logo"
                width={50} // Adjust width as needed
                height={50} // Adjust height as needed
                style={{ marginRight: '10px' }}
              />
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                MyPolls
              </span>
            </Link>

            {/* Auth Buttons */}
            <AuthButtons />
          </header>

          {/* Main content */}
          <main style={{ padding: '20px' }}>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}