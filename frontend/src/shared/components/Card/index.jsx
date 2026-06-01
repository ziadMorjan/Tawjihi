// src/shared/components/Card/index.jsx
import { StyledCard } from './Card.styles';

export function Card({ children, hoverable = false, padding = 'none', ...props }) {
  return (
    <StyledCard $hoverable={hoverable} $padding={padding} {...props}>
      {children}
    </StyledCard>
  );
}