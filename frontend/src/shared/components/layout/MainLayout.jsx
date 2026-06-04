// src/shared/components/Layout/MainLayout.jsx
import styled from 'styled-components';
import { Navbar } from '../../../components/Layout/Navbar';

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.bgSecondary};
`;

const Main = styled.main`
  flex: 1;
`;

export function MainLayout({ children }) {
  return (
    <PageWrapper>
      <Navbar />
      <Main>{children}</Main>
    </PageWrapper>
  );
}