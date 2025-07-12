import styled from "styled-components"

// Styled Components
export const PaginationWrapper = styled.div`
  display: block;
  margin: auto;
`

export const PaginationContainer = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  margin: 20px 0px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 6px;
  }

  @media (max-width: 480px) {
    gap: 4px;
  }
`

export const PaginationButton = styled.button`
  min-width: 36px;
  height: 36px;
  padding: 0 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  color: #007bff;
  cursor: pointer;
  transition: all 0.2s ease;

  svg {
    transform: none;
  }

  &:hover:not(:disabled):not([data-active="true"]) {
    background-color: #f0f0f0;
  }

  ${({ $active }) =>
    $active &&
    `
    background-color: #007bff;
    color: white;
    border-color: #007bff;
  `}

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    min-width: 32px;
    height: 32px;
    padding: 0 10px;
    font-size: 13px;
  }

  @media (max-width: 480px) {
    min-width: 28px;
    height: 28px;
    padding: 0 8px;
    font-size: 12px;
  }
`
