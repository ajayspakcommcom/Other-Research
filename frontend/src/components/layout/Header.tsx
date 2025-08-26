import React, { useState } from 'react';
import styled from 'styled-components';
import { FaBell, FaSearch, FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useAuthActions } from '@/hooks/useAuthActions';
import { Button } from '@/components/common/Button';

const HeaderContainer = styled.header`
  background: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[6]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 500px;
  margin: 0 ${({ theme }) => theme.space[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[10]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.radii.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  background-color: ${({ theme }) => theme.colors.gray[50]};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    background-color: ${({ theme }) => theme.colors.white};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  left: ${({ theme }) => theme.space[3]};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.gray[400]};
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[4]};
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.gray[100]};
  color: ${({ theme }) => theme.colors.gray[600]};
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: ${({ theme }) => theme.colors.gray[200]};
    color: ${({ theme }) => theme.colors.gray[700]};
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary[500]};
    outline-offset: 2px;
  }
`;

const UserSection = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: none;
  }
`;

const UserName = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const UserRole = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  text-transform: capitalize;
`;

const Avatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.primary[600]};
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[700]};
  }
`;

const Dropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: ${({ theme }) => theme.space[2]};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => theme.space[2]};
  min-width: 200px;
  z-index: 50;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[4]};
  text-align: left;
  border: none;
  background: none;
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  color: ${({ theme }) => theme.colors.gray[700]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
  }

  &.danger {
    color: ${({ theme }) => theme.colors.error};
  }
`;

export const Header: React.FC = () => {
  const { user } = useAuth();
  const { logout } = useAuthActions();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <HeaderContainer>
      <SearchContainer>
        <SearchIcon />
        <SearchInput placeholder="Search..." />
      </SearchContainer>

      <RightSection>
        <IconButton>
          <FaBell />
        </IconButton>

        <UserSection>
          <UserInfo>
            <UserName>{user?.firstName} {user?.lastName}</UserName>
            <UserRole>{user?.role}</UserRole>
          </UserInfo>
          
          <Avatar onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt="Avatar" 
                style={{ width: '100%', height: '100%', borderRadius: '50%' }}
              />
            ) : (
              getInitials(user?.firstName, user?.lastName)
            )}
          </Avatar>

          <Dropdown isOpen={isDropdownOpen}>
            <DropdownItem onClick={() => setIsDropdownOpen(false)}>
              <FaUser />
              Profile
            </DropdownItem>
            <DropdownItem onClick={() => setIsDropdownOpen(false)}>
              <FaCog />
              Settings
            </DropdownItem>
            <DropdownItem className="danger" onClick={handleLogout}>
              <FaSignOutAlt />
              Sign Out
            </DropdownItem>
          </Dropdown>
        </UserSection>
      </RightSection>
    </HeaderContainer>
  );
};