import React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { FaUsers, FaChartLine, FaServer, FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

const Container = styled.div`
  max-width: 1200px;
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.space[6]};
  margin-bottom: ${({ theme }) => theme.space[8]};
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.space[6]};
  box-shadow: ${({ theme }) => theme.shadows.md};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const StatIcon = styled.div<{ color: string }>`
  width: 3rem;
  height: 3rem;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ color }) => color}20;
  color: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.space[4]};

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const StatChange = styled.div<{ positive: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ positive, theme }) =>
    positive ? theme.colors.success : theme.colors.error};
`;

const WelcomeCard = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[600]} 0%, ${({ theme }) => theme.colors.primary[800]} 100%);
  color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.space[8]};
  margin-bottom: ${({ theme }) => theme.space[8]};
`;

const WelcomeTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const WelcomeText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.base};
  opacity: 0.9;
  margin: 0;
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.space[4]};
`;

const ActionCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.space[6]};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[300]};
    transform: translateY(-1px);
  }
`;

const ActionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const ActionDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin: 0;
`;

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      icon: FaUsers,
      value: '1,234',
      label: 'Total Users',
      change: '+12%',
      positive: true,
      color: '#3b82f6',
    },
    {
      icon: FaChartLine,
      value: '98.5%',
      label: 'Uptime',
      change: '+0.5%',
      positive: true,
      color: '#10b981',
    },
    {
      icon: FaServer,
      value: '45ms',
      label: 'Avg Response',
      change: '-5ms',
      positive: true,
      color: '#f59e0b',
    },
    {
      icon: FaShieldAlt,
      value: '100%',
      label: 'Security Score',
      change: 'No change',
      positive: true,
      color: '#ef4444',
    },
  ];

  const quickActions = [
    {
      title: 'User Management',
      description: 'Manage user accounts and permissions',
    },
    {
      title: 'System Health',
      description: 'Check system status and performance',
    },
    {
      title: 'Analytics',
      description: 'View detailed analytics and reports',
    },
    {
      title: 'Settings',
      description: 'Configure platform settings',
    },
  ];

  return (
    <Container>
      <Helmet>
        <title>Dashboard - Spak Communication Platform</title>
      </Helmet>

      <Header>
        <Title>Dashboard</Title>
        <Subtitle>Welcome back to your communication hub</Subtitle>
      </Header>

      <WelcomeCard>
        <WelcomeTitle>
          Welcome back, {user?.firstName}! 👋
        </WelcomeTitle>
        <WelcomeText>
          Here's what's happening with your platform today. Everything looks great!
        </WelcomeText>
      </WelcomeCard>

      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard key={index}>
            <StatIcon color={stat.color}>
              <stat.icon />
            </StatIcon>
            <StatValue>{stat.value}</StatValue>
            <StatLabel>{stat.label}</StatLabel>
            <StatChange positive={stat.positive}>
              {stat.change}
            </StatChange>
          </StatCard>
        ))}
      </StatsGrid>

      <Header>
        <Title style={{ fontSize: '2rem', marginBottom: '1rem' }}>
          Quick Actions
        </Title>
      </Header>

      <QuickActions>
        {quickActions.map((action, index) => (
          <ActionCard key={index}>
            <ActionTitle>{action.title}</ActionTitle>
            <ActionDescription>{action.description}</ActionDescription>
          </ActionCard>
        ))}
      </QuickActions>
    </Container>
  );
};

export default DashboardPage;