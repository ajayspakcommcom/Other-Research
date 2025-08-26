import React from 'react';
import styled from 'styled-components';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.gray[50]};
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.space[6]};
  max-width: 100%;
  overflow-x: auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.space[4]};
  }
`;

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <Sidebar />
      <MainContent>
        <Header />
        <ContentArea>
          {children}
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  );
};