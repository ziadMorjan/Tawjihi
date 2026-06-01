// src/shared/components/Spinner/index.jsx
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const StyledSpinner = styled.div`
  display: inline-block;
  border-radius: 50%;
  border: 2px solid currentColor;
  border-top-color: transparent;
  animation: ${spin} 0.6s linear infinite;
  flex-shrink: 0;

  ${({ $size }) => {
    const sizes = {
      sm: '16px',
      md: '24px',
      lg: '36px',
    };
    const s = sizes[$size] || sizes.md;
    return `width: ${s}; height: ${s};`;
  }}
`;

export function Spinner({ size = 'md' }) {
  return <StyledSpinner $size={size} aria-label="جارٍ التحميل" role="status" />;
}