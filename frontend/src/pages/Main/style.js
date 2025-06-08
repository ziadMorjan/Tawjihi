import styled from "styled-components";

export const ImgLogo = styled.img`
  width: 10rem;
`;

export const Wrappers = styled.div`
  background-color: var(--color-primary);
  color: #fff;
  text-align: center;
  padding: 12px 0;
`;

export const WrapperUl = styled.ul`
  display: flex;
  align-items: center;
  justify-content: center;
  list-style: none;
  margin: 40px 0px;
  padding: 0;

  li {
    margin: 0px 50px;
    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
      color: var(--color-primary); 
    }
  }

.active{
  color: var(--color-primary);
}
`;


export const Wrapper = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: space-between;
`

export const WrapperCards = styled.div`
  display: flex;
  align-items: center;
  justify-content: center; 
  flex-wrap: wrap;
  gap: 20px;
  margin: 20px 0px;
`;


