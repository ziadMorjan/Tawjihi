import styled from "styled-components";

export const SidebarContainer = styled.aside`
  width: 20%;
  padding: 20px;
  box-shadow: 0px 4px 6px 2px ${({ theme }) => theme.box_shadow};
  overflow-y: auto;
  background-color: ${({ theme }) => theme.background};
  transition: right 0.3s ease, width 0.3s ease;
  position: relative;
  z-index: 1;

  @media (max-width: 1024px) {
    width: 25%;
  }

  @media (max-width: 768px) {
    width: 50%;
    height: 100vh;
    padding: 30px;
    position: absolute;
    top: 0;
    right: ${(props) => (props.isOpen ? "0" : "-100%")};
    z-index: 10000;
    box-shadow: 0px 10px 10px -2px rgba(0, 0, 0, 0.2);
    transition: right 0.3s ease;
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
