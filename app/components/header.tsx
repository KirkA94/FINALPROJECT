'use client';

import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext'; // Adjust the path as needed
import { useRouter } from 'next/navigation';

export default function Header() {
  const { isAuthenticated, logout, user } = useAuth(); // Access authentication state and user info
  const router = useRouter();

  const handleLogout = () => {
    logout(); // Log the user out
    router.push('/'); // Redirect to the home page after logout
  };

  return (
    <header style={headerStyle}>
      <div style={logoStyle}>
        <Link href="/" style={{ textDecoration: 'none', color: '#007bff' }}>
          <h1>MyPolls</h1>
        </Link>
      </div>
      <nav>
        <ul style={navListStyle}>
          <li style={navItemStyle}>
            <Link href="/" style={linkStyle}>
              Home
            </Link>
          </li>
          <li style={navItemStyle}>
            <Link href="/polls" style={linkStyle}>
              Polls
            </Link>
          </li>
          {isAuthenticated && (
            <>
              <li style={navItemStyle}>
                <Link href="/dashboard" style={linkStyle}>
                  Dashboard
                </Link>
              </li>
              <li style={navItemStyle}>
                <button onClick={handleLogout} style={logoutButtonStyle}>
                  Logout
                </button>
              </li>
            </>
          )}
          {!isAuthenticated && (
            <li style={navItemStyle}>
              <Link href="/login" style={linkStyle}>
                Login
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

// Styles
const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 20px',
  backgroundColor: '#f8f9fa',
  borderBottom: '1px solid #ddd',
};

const logoStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
};

const navListStyle = {
  listStyle: 'none',
  display: 'flex',
  margin: 0,
  padding: 0,
};

const navItemStyle = {
  marginLeft: '15px',
};

const linkStyle = {
  textDecoration: 'none',
  color: '#007bff',
};

const logoutButtonStyle = {
  padding: '5px 10px',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};