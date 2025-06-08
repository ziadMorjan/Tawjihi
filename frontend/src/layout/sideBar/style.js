import styled from "styled-components";

export const SidebarContainer = styled.aside`
 
  width: 20%;
  height: 90vh;
  padding: 20px;
  box-shadow: 0px 4px 6px -2px rgba(0, 0, 0, 0.2); /* horizontal only */
  overflow-y: auto;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 30%;
  }
`;

export const SidebarHeader = styled.h2`
  margin-bottom: 20px;
  font-size: 22px;
  text-align: center;
`;

export const CheckSection = styled.div`
  display: flex;
  flex-direction: column;
`;
