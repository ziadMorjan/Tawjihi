import styled from "styled-components";

export const ButtonLogin = styled("button")`
    width: 10rem;
    background-color: transparent;
    border: 1px solid var(--color-border);
    color:#333;
    padding:5px 0px;
    border-radius: 3px;
    transition: all 0.5s;
    cursor: pointer;
    font-family : 'Amiri';

    &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    color: #999;
    border-color: #ccc;
    pointer-events: none; /* prevent hover effect */ 
    }

    &:hover {
      color:var(--color-primary);
      border: 1px solid var(--color-primary);
    }

    @media (max-width: 767px) {
      width: 100px;
    }

    & .spinner {
    width: 16px;
    height: 16px;
    margin-right: 5px;
    border: 3px solid #fff;
    border-top: 3px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }



   
  `;