import styled from "styled-components";

export const WrapperNav = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* subtle bottom shadow */
  background-color: var(--color-background); /* optional for clarity */
  padding: 0.5rem 1rem; /* optional for spacing inside navbar */
`;


export const WrapperElementFlexCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;


export const WrapperElementFlexSpace = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  @media (max-width: 767px) {
    justify-content: space-around;
    align-items: center;
 

    
  }
`;
