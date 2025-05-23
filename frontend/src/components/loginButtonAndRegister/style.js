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

    &:hover {
      color:var(--color-primary);
      border: 1px solid var(--color-primary);
    }
  `;