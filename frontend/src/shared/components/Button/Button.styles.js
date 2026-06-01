// src/shared/components/Button/Button.styles.js
import styled, { css } from 'styled-components';


const variants = {
  primary: css`
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.textInverse};
    border: 2px solid transparent;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.primaryHover};
    }
  `,

  secondary: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.primary};
    border: 2px solid ${({ theme }) => theme.colors.primary};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.primaryLight};
    }
  `,

  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.textSecondary};
    border: 2px solid transparent;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.bgTertiary};
      color: ${({ theme }) => theme.colors.textPrimary};
    }
  `,

  danger: css`
    background: ${({ theme }) => theme.colors.danger};
    color: ${({ theme }) => theme.colors.textInverse};
    border: 2px solid transparent;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.danger};
      opacity: 0.9;
    }
  `,

  success: css`
    background: ${({ theme }) => theme.colors.success};
    color: ${({ theme }) => theme.colors.textInverse};
    border: 2px solid transparent;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.success};
      opacity: 0.9;
    }
  `,
};

const sizes = {
  sm: css`
    padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    border-radius: ${({ theme }) => theme.borderRadius.md};
  `,
  md: css`
    padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[6]}`};
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
  `,
  lg: css`
    padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[8]}`};
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
  `,
};

export const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  border: none;
  transition: ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;
  text-decoration: none;

  /* Variants */
  ${({ $variant = 'primary' }) => variants[$variant]}

  /* Sizes */
  ${({ $size = 'md' }) => sizes[$size]}

  /* Full width */
  ${({ $fullWidth }) => $fullWidth && css`width: 100%;`}

  /* Disabled */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Loading state */
  ${({ $loading }) => $loading && css`
    opacity: 0.8;
    cursor: wait;
    pointer-events: none;
  `}
`;