import { createGlobalStyle } from 'styled-components'
import { normalize } from 'styled-normalize'
 
export const GlobalStyle = createGlobalStyle`
  ${normalize}
 
  body {
    box-sizing: border-box;
    font-family: Helvetica, Arial, sans-serif;
  }
`
