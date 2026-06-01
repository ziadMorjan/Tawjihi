// src/shared/components/Badge/index.jsx
import styled, { css } from 'styled-components';

const variants = {
  primary: css`
    background: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.primary};
  `,
  success: css`
    background: ${({ theme }) => theme.colors.successLight};
    color: ${({ theme }) => theme.colors.success};
  `,
  warning: css`
    background: ${({ theme }) => theme.colors.warningLight};
    color: ${({ theme }) => theme.colors.warning};
  `,
  danger: css`
    background: ${({ theme }) => theme.colors.dangerLight};
    color: ${({ theme }) => theme.colors.danger};
  `,
  accent: css`
    background: ${({ theme }) => theme.colors.accentLight};
    color: ${({ theme }) => theme.colors.accent};
  `,
  gray: css`
    background: ${({ theme }) => theme.colors.bgTertiary};
    color: ${({ theme }) => theme.colors.textSecondary};
  `,
};

const StyledBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[3]}`};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  white-space: nowrap;

  ${({ $variant = 'primary' }) => variants[$variant]}
`;

export function Badge({ children, variant = 'primary', icon, ...props }) {
  return (
    <StyledBadge $variant={variant} {...props}>
      {icon && icon}
      {children}
    </StyledBadge>
  );
}