import styled from "styled-components";

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--color-heading);
  padding: 15px;
  position: relative;
  flex-wrap: wrap;


  .navBarItems {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    list-style: none;
    transition: all 0.3s ease-in-out;
  }

  .navBarItems li a {
    color: var(--color-dark-text);
    text-decoration: none;
    font-size: 16px;
    transition: color 0.2s ease-in-out;
  }

  .navBarItems li a:hover {
    color: var(--color-primary);
  }

  @media (max-width: 767px) {


    .navBarItems {
      display: none;
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
      padding: 10px 0;
    }

    .navBarItems.open {
      display: flex;
    }

    .navBarItems li {
      margin: 10px 0;
    }
  }
.active {
  color: var(--color-primary); /* or any highlight style */
  font-weight: bold;
  border-bottom: 2px solid var(--color-primary);
}
`;
