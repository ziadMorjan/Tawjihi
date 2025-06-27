import styled from "styled-components";

export const PaginationsWraper = styled.div`
  display: block;
  margin: 20px auto;

  & div.pagination {
    display: flex;
    gap: 8px;
    justify-content: center;
    margin-top: 20px;
    flex-wrap: wrap;

    & button {
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
      color: var(--color-primary);
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover:not(.active-page):not(:disabled) {
        background-color: #f0f0f0;
      }

      &.active-page {
        background-color: var(--color-primary);
        color: white;
        border-color: var(--color-primary);
      }

      & svg {
        transform: none;
      }

      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
    }
  }

  /* Tablet */
  @media (max-width: 768px) {
    & div.pagination {
      gap: 6px;

      & button {
        min-width: 32px;
        height: 32px;
        padding: 0 10px;
        font-size: 13px;
      }
    }
  }

  /* Mobile */
  @media (max-width: 480px) {
    & div.pagination {
      gap: 4px;

      & button {
        min-width: 28px;
        height: 28px;
        padding: 0 8px;
        font-size: 12px;
      }
    }
  }
`;
