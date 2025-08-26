import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaUser, FaChartBar, FaCog, FaQuestionCircle } from 'react-icons/fa';

const SidebarContainer = styled.aside`
  width: 250px;
  background: ${({ theme }) => theme.colors.white};
  border-right: 1px solid ${({ theme }) => theme.colors.gray[200]};
  height: 100vh;
  overflow-y: auto;
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    width: 200px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    position: fixed;
    left: -250px;
    z-index: 40;
    transition: left 0.3s ease-in-out;
  }
`;

const Logo = styled.div`
  padding: ${({ theme }) => theme.space[6]} ${({ theme }) => theme.space[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const LogoText = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary[600]};
  margin: 0;
`;

const LogoSubtext = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  margin: 0;
  margin-top: ${({ theme }) => theme.space[1]};
`;

const Navigation = styled.nav`
  padding: ${({ theme }) => theme.space[4]} 0;
`;

const NavSection = styled.div`
  margin-bottom: ${({ theme }) => theme.space[6]};

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray[400]};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 ${({ theme }) => theme.space[3]} 0;
  padding: 0 ${({ theme }) => theme.space[4]};
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[4]};
  color: ${({ theme }) => theme.colors.gray[600]};
  text-decoration: none;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  transition: all 0.2s ease-in-out;
  border-left: 3px solid transparent;

  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
    color: ${({ theme }) => theme.colors.gray[900]};
  }

  &.active {
    background: ${({ theme }) => theme.colors.primary[50]};
    color: ${({ theme }) => theme.colors.primary[700]};
    border-left-color: ${({ theme }) => theme.colors.primary[600]};
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
  }
`;

const Footer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${({ theme }) => theme.space[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  background: ${({ theme }) => theme.colors.white};
`;

const FooterText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  margin: 0;
  text-align: center;
`;

const menuItems = [
  {
    section: 'Main',
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: FaHome },
      { path: '/profile', label: 'Profile', icon: FaUser },
    ],
  },
  {
    section: 'Analytics',
    items: [
      { path: '/analytics', label: 'Analytics', icon: FaChartBar },
    ],
  },
  {
    section: 'Settings',
    items: [
      { path: '/settings', label: 'Settings', icon: FaCog },
      { path: '/help', label: 'Help', icon: FaQuestionCircle },
    ],
  },
];

export const Sidebar: React.FC = () => {
  return (
    <SidebarContainer>
      <Logo>
        <LogoText>Spak Platform</LogoText>
        <LogoSubtext>Communication Hub</LogoSubtext>
      </Logo>

      <Navigation>
        {menuItems.map((section) => (
          <NavSection key={section.section}>
            <SectionTitle>{section.section}</SectionTitle>
            {section.items.map((item) => (
              <NavItem
                key={item.path}
                to={item.path}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                <item.icon />
                {item.label}
              </NavItem>
            ))}
          </NavSection>
        ))}
      </Navigation>

      <Footer>
        <FooterText>© 2024 Spak Communication</FooterText>
      </Footer>
    </SidebarContainer>
  );
};