// src/pages/Auth/components/AuthLayout.jsx
import { useNavigate } from 'react-router-dom';
import {
  PageWrapper, LeftPanel, PanelTitle, PanelSubtitle,
  RightPanel, FormCard,
} from './AuthLayout.styles';

export function AuthLayout({ children, panelTitle, panelSubtitle }) {
  return (
    <PageWrapper>
      <LeftPanel>
        <img src="/assets/img/logo.png" alt="Tawjihi" style={{ height: 64 }} />
        <PanelTitle>{panelTitle}</PanelTitle>
        <PanelSubtitle>{panelSubtitle}</PanelSubtitle>
      </LeftPanel>

      <RightPanel>
        <FormCard>
          {children}
        </FormCard>
      </RightPanel>
    </PageWrapper>
  );
}