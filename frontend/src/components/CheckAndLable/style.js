import styled from "styled-components";

export const CheckBox = styled.input`
  margin: 0px 5px;
`;

export const Label = styled.label`
  font-size: 16px;
  cursor: pointer;
  user-select: none;

`;

export const CheckAndLabelWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 4px;
  transition: background 0.2s ease;

  &:hover {
    background-color: var(--color-primary);
  }

`;

export const CheckAndLabelContainer = styled.div`
  width: 100%;
  
`;
