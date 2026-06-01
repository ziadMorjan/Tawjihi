// src/shared/components/Input/Input.styles.js
import styled, { css } from 'styled-components';

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  width: 100%;
`;

export const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textPrimary};
  background: ${({ theme }) => theme.colors.bgPrimary};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: ${({ theme }) => theme.transitions.fast};
  outline: none;
  direction: rtl;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderStrong};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight};
  }

  /* Error state */
  ${({ $hasError, theme }) => $hasError && css`
    border-color: ${theme.colors.danger};
    &:focus {
      box-shadow: 0 0 0 3px ${theme.colors.dangerLight};
    }
  `}

  /* With icon padding */
  ${({ $hasLeftIcon, theme }) => $hasLeftIcon && css`
    padding-left: ${theme.spacing[10]};
  `}
  ${({ $hasRightIcon, theme }) => $hasRightIcon && css`
    padding-right: ${theme.spacing[10]};
  `}

  &:disabled {
    background: ${({ theme }) => theme.colors.bgTertiary};
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export const IconWrapper = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textMuted};
  pointer-events: none;

  ${({ $position }) => $position === 'left'
    ? css`left: 12px;`
    : css`right: 12px;`
  }
`;

export const ErrorMessage = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.danger};
`;

export const HelperText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;