import styled from "styled-components";

export const WrapperSearch = styled.div`
  background-color: var(--color-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 100px 0px;

`;

export const SvgICon = styled.svg`
  width: 40px;
  height: 50px;
  outline: none;
  cursor: pointer;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  background-color: #fff;
  fill: var(--color-primary);
    transition: all 0.5s linear;

  &.iconBar {
    /* optional additional styles */
  }
`;

export const InputBar = styled.input`
  width: 60%;
  height: 50px;
  border: none;
  outline: none;
  font-size: 20px;
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
  padding: 0px 15px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
    transition: all 0.5s linear;

  &::placeholder {
    font-size: 18px;
  }

  @media (max-width: 768px) {
    width: 80%;    
  }
`;
