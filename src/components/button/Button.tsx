import styled from "styled-components";

const ButtonStyle = styled.button`
  color: ${props => props.theme.dark};
  text-align: center;
  cursor: ${props => props.disabled ? "default" : "pointer"};
  border-radius: ${props => props.theme.radius};
  border: none;
  white-space: nowrap;
  vertical-align: middle;
  background-color: '#fff';
  min-width: 80px; 
  padding: 10px 34px; 
  font-size: 16px;
`;

export const Button = (props: any) => {
  return <ButtonStyle {...props}></ButtonStyle>
}