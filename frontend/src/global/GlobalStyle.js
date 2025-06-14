import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`

body{
  transition: all 1s;

${(props) => props.theme ? `background-color : ${props.theme.background};
    color : ${props.theme.color}` : ''}
}
`