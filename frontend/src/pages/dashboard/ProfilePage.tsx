import React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { FaUser, FaEnvelope, FaCalendar, FaShieldAlt, FaGithub } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.space[8]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin: 0;
`;

const ProfileCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.space[8]};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  margin-bottom: ${({ theme }) => theme.space[8]};
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[6]};
  margin-bottom: ${({ theme }) => theme.space[8]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    text-align: center;
  }
`;

const Avatar = styled.div`
  width: 5rem;
  height: 5rem;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.primary[600]};
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  flex-shrink: 0;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const ProfileEmail = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const ProfileRole = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  background: ${({ theme }) => theme.colors.primary[100]};
  color: ${({ theme }) => theme.colors.primary[700]};
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[3]};
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-transform: capitalize;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.space[6]};
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => theme.space[4]};
  background: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.radii.lg};
`;

const InfoIcon = styled.div<{ color: string }>`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ color }) => color}20;
  color: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[500]};
  margin-bottom: ${({ theme }) => theme.space[1]};
`;

const InfoValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const StatusBadge = styled.span<{ status: 'active' | 'inactive' | 'verified' | 'unverified' }>`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[3]};
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-transform: capitalize;
  
  ${({ status, theme }) => {
    switch (status) {
      case 'active':
        return `
          background: ${theme.colors.success}20;
          color: #166534;
        `;
      case 'inactive':
        return `
          background: ${theme.colors.error}20;
          color: #dc2626;
        `;
      case 'verified':
        return `
          background: ${theme.colors.success}20;
          color: #166534;
        `;
      case 'unverified':
        return `
          background: ${theme.colors.warning}20;
          color: #d97706;
        `;
      default:
        return `
          background: ${theme.colors.gray[200]};
          color: ${theme.colors.gray[700]};
        `;
    }
  }}
`;

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Container>
      <Helmet>
        <title>Profile - Spak Communication Platform</title>
      </Helmet>

      <Header>
        <Title>Profile</Title>
        <Subtitle>Manage your account information and settings</Subtitle>
      </Header>

      <ProfileCard>
        <ProfileHeader>
          <Avatar>
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
          
          <ProfileInfo>
            <ProfileName>
              {user?.firstName} {user?.lastName}
            </ProfileName>
            <ProfileEmail>{user?.email}</ProfileEmail>
            <ProfileRole>
              <FaShieldAlt />
              {user?.role}
            </ProfileRole>
          </ProfileInfo>
        </ProfileHeader>

        <InfoGrid>
          <InfoItem>
            <InfoIcon color="#3b82f6">
              <FaEnvelope />
            </InfoIcon>
            <InfoContent>
              <InfoLabel>Email Status</InfoLabel>
              <InfoValue>
                <StatusBadge status={user?.isEmailVerified ? 'verified' : 'unverified'}>
                  {user?.isEmailVerified ? 'Verified' : 'Unverified'}
                </StatusBadge>
              </InfoValue>
            </InfoContent>
          </InfoItem>

          <InfoItem>
            <InfoIcon color="#10b981">
              <FaUser />
            </InfoIcon>
            <InfoContent>
              <InfoLabel>Account Status</InfoLabel>
              <InfoValue>
                <StatusBadge status={user?.isActive ? 'active' : 'inactive'}>
                  {user?.isActive ? 'Active' : 'Inactive'}
                </StatusBadge>
              </InfoValue>
            </InfoContent>
          </InfoItem>

          <InfoItem>
            <InfoIcon color="#8b5cf6">
              <FaCalendar />
            </InfoIcon>
            <InfoContent>
              <InfoLabel>Member Since</InfoLabel>
              <InfoValue>{formatDate(user?.createdAt)}</InfoValue>
            </InfoContent>
          </InfoItem>

          <InfoItem>
            <InfoIcon color="#f59e0b">
              <FaGithub />
            </InfoIcon>
            <InfoContent>
              <InfoLabel>Authentication</InfoLabel>
              <InfoValue style={{ textTransform: 'capitalize' }}>
                {user?.provider}
              </InfoValue>
            </InfoContent>
          </InfoItem>
        </InfoGrid>
      </ProfileCard>
    </Container>
  );
};

export default ProfilePage;