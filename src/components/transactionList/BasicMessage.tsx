import styled from 'styled-components';

const BasicMessageStyle = styled.div`
  display: flex;
  color: ${props => props.theme.yellow};
  justify-content: center;
`;

export default function BasicMessage({children}: {children: any}) {

  return (
    <BasicMessageStyle>{children}</BasicMessageStyle>
  )
}