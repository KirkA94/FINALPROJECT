'use client';

import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

export default function Header() {
  const { isAuthenticated, logout } = useAuth(); // Removed unused `user`
  const router = useRouter();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    router.push('/');
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
const HeaderContainer = styled.header``;
const LogoContainer = styled.div``;
const LogoLink = styled.div``;
const LogoImage = styled.img``;
const SiteName = styled.span``;
const Nav = styled.nav``;
const NavList = styled.ul``;
const NavItem = styled.li``;
const LogoutButton = styled.button``;