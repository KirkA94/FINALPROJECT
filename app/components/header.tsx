'use client';

import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext'; // Adjust the path as needed
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

export default function Header() {
  const { isAuthenticated, logout, user } = useAuth(); // Access authentication state and user info
  const router = useRouter();

  const handleLogout = () => {
    logout(); // Log the user out
    localStorage.removeItem("token"); // Clear the token from local storage
    router.push('/'); // Redirect to the home page after logout
  };

  return (
    <HeaderContainer>
      <LogoContainer>
        <Link href="/">
          <LogoLink>
            <LogoImage src="/logo.png" alt="MyPolls Logo" />
            <SiteName>MyPolls</SiteName>
          </LogoLink>
        </Link>
      </LogoContainer>
      <Nav>
        <NavList>
          <NavItem>
            <Link href="/">Home</Link>
          </NavItem>
          <NavItem>
            <Link href="/polls">Polls</Link>
          </NavItem>
          {isAuthenticated && (
            <>
              <NavItem>
                <Link href="/dashboard">Dashboard</Link>
              </NavItem>
              <NavItem>
                <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
              </NavItem>
            </>
          )}
          {!isAuthenticated && (
            <NavItem>
              <Link href="/login">Login</Link>
            </NavItem>
          )}
        </NavList>
      </Nav>
    </HeaderContainer>
  );
}

// Styled Components
const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: #ffffff;
  border-bottom: 1px solid #ddd;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const LogoLink = styled.div`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #007bff;
`;

const LogoImage = styled.img`
  height: 40px;
  margin-right: 10px;
`;

const SiteName = styled.span`
  font-size: 24px;
  font-weight: bold;
  color: #333;
`;

const Nav = styled.nav``;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  margin-left: 20px;

  a {
    text-decoration: none;
    color: #007bff;
    font-size: 16px;
    font-weight: 500;
    transition: color 0.3s ease;

    &:hover {
      color: #0056b3;
    }
  }
`;

const LogoutButton = styled.button`
  padding: 8px 15px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #b02a37;
  }

  &:active {
    transform: scale(0.96);
  }
`;