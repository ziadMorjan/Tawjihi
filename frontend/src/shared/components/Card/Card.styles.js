// src/shared/components/Card/Card.styles.js
import styled, { css } from 'styled-components';

export const StyledCard = styled.div`
  background: ${({ theme }) => theme.colors.bgPrimary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
  transition: ${({ theme }) => theme.transitions.normal};

  ${({ $hoverable, theme }) => $hoverable && css`
    cursor: pointer;
    &:hover {
      border-color: ${theme.colors.borderStrong};
      box-shadow: ${theme.shadows.lg};
      transform: translateY(-2px);
    }
  `}

  ${({ $padding, theme }) => {
    const paddings = {
      none: 'padding: 0',
      sm:   `padding: ${theme.spacing[4]}`,
      md:   `padding: ${theme.spacing[6]}`,
      lg:   `padding: ${theme.spacing[8]}`,
    };
    return paddings[$padding] || paddings.none;
  }}
`;