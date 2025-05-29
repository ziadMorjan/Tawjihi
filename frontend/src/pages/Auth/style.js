import { Link } from "react-router-dom";
import styled from "styled-components";

// Auth Wrapper
export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 2rem;
  gap: 1rem;



  @media (max-width: 1024px) {
    flex-direction: column-reverse;
    padding: 1rem;

  }
`;

// Navigation Tabs
export const UlWrapper = styled.ul`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
  flex-wrap: wrap;

  & li {
    margin: 0 10px;
  }

  @media (max-width: 576px) {
    & li {
      margin: 10px;
    }
  }
`;

// Active Link
export const StyledNavLink = styled(Link)`
  padding: 10px 15px;
  text-decoration: none;
  color: #555;
  font-weight: 500;
  transition: all 0.3s;

  ${({ $active }) =>
    $active &&
    `
    color: var(--color-primary);
    font-weight: bold;
    text-decoration: underline;
  `}


`;