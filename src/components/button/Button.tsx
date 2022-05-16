import styled from "styled-components";

export const Button = styled.button`
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
