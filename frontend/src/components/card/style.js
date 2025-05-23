import styled from "styled-components";

export const CardDiv = styled.div`
width: fit-content;
border:1px solid var(--color-primary);
border-radius: 8px;
padding: 10px;
cursor: pointer;
transition: all 0.2s linear;
width: 350px;



box-shadow: 0px 0px 0px 0px var(--color-border);



& img{
    width: 100%;
    border-bottom: 1px solid var(--color-primary);
    
}

& span{
    display: block;
    margin: 5px 0px;
}

&:hover{
    transform: scale(1.03);
    box-shadow: 0px 0px 1px 1px var(--color-primary);

}

@media (max-width: 767px){
    width: 350px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
`



export const IconStarDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  flex-wrap: wrap;
  gap: 8px;
`;

export const StarWrapper = styled.div`
  display: flex;
  gap: 4px;
  font-size: 18px;
`;
