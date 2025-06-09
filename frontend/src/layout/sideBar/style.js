import styled from "styled-components";

export const SidebarContainer = styled.aside`
  width: 20%;
  padding: 20px;
  box-shadow: 0px 4px 6px -2px rgba(0, 0, 0, 0.2);
  overflow-y: hidden;
  background-color: #fff;
  transition: all 0.3s ease;

  @media (max-width: 1024px) {
    width: 25%;
  }

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    box-shadow: none;
    padding: 16px;
    border-bottom: 1px solid #e5e7eb;
  }

  @media (max-width: 480px) {
    width: 100%;
    height: auto;
    padding: 12px;
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
