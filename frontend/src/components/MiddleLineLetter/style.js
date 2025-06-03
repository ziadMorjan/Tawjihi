import styled from "styled-components";

export const MiddleLineLetterStyle = styled.div`
  width: 100%;
  height: 2px;
  background-color: var(--color-primary);
  margin: 30px auto;
  position: relative;

  & > span {
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    background-color: white;
    padding: 0 10px;
    font-size: 14px;
    color: var(--text-color, #333);
    white-space: nowrap;
    background-color:#f9f9f9;
  }
`;
